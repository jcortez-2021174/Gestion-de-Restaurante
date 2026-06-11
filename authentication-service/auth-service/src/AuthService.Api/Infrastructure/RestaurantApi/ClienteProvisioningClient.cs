using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using AuthService.Application.DTOs.Identity;
using AuthService.Application.Interfaces;
using Microsoft.Extensions.Options;

namespace AuthService.Api.Infrastructure.RestaurantApi;

public sealed class ClienteProvisioningClient(
    HttpClient httpClient,
    IOptions<RestaurantApiOptions> options,
    ILogger<ClienteProvisioningClient> logger) : IClienteProvisioningClient
{
    private const string ProvisioningPath =
        "/AureaRestaurant/Admin/v1/internal/identity/clientes/provision";
    private const string InternalApiKeyHeader = "X-Internal-API-Key";

    private readonly RestaurantApiOptions _options = options.Value;

    public async Task<ClienteProvisioningResult> ProvisionAsync(
        ClienteProvisioningRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ProvisioningKey))
        {
            logger.LogError(
                "Cliente provisioning is not configured for AuthUserId {AuthUserId}: " +
                "RestaurantApi:ProvisioningKey is missing",
                request.AuthUserId);

            return ClienteProvisioningResult.Failure(
                null,
                0,
                "IDENTITY_PROVISIONING_NOT_CONFIGURED",
                "RestaurantApi:ProvisioningKey is missing");
        }

        var maxAttempts = Math.Max(1, _options.MaxRetryAttempts);

        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                using var message = new HttpRequestMessage(HttpMethod.Post, ProvisioningPath)
                {
                    Content = JsonContent.Create(request),
                };
                message.Headers.Add(InternalApiKeyHeader, _options.ProvisioningKey);

                using var response = await httpClient.SendAsync(message, cancellationToken);
                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    var payload = JsonSerializer.Deserialize<ClienteProvisioningResponseDto>(
                        responseBody,
                        new JsonSerializerOptions(JsonSerializerDefaults.Web));

                    if (payload is { Success: true, Data: not null } &&
                        payload.Data.AuthUserId == request.AuthUserId)
                    {
                        return ClienteProvisioningResult.Success(
                            (int)response.StatusCode,
                            attempt,
                            payload.Data);
                    }

                    logger.LogError(
                        "Cliente provisioning returned an invalid success response for AuthUserId " +
                        "{AuthUserId}. StatusCode {StatusCode}, Attempt {Attempt}, Response {Response}",
                        request.AuthUserId,
                        (int)response.StatusCode,
                        attempt,
                        responseBody);

                    return ClienteProvisioningResult.Failure(
                        (int)response.StatusCode,
                        attempt,
                        "INVALID_PROVISIONING_RESPONSE",
                        "The provisioning response did not contain the expected identity");
                }

                var error = DeserializeError(responseBody);
                var shouldRetry = IsTransient(response.StatusCode) && attempt < maxAttempts;

                logger.Log(
                    shouldRetry ? LogLevel.Warning : LogLevel.Error,
                    "Cliente provisioning failed for AuthUserId {AuthUserId}. StatusCode {StatusCode}, " +
                    "ErrorCode {ErrorCode}, Attempt {Attempt}/{MaxAttempts}, Response {Response}",
                    request.AuthUserId,
                    (int)response.StatusCode,
                    error.ErrorCode,
                    attempt,
                    maxAttempts,
                    responseBody);

                if (!shouldRetry)
                {
                    return ClienteProvisioningResult.Failure(
                        (int)response.StatusCode,
                        attempt,
                        error.ErrorCode,
                        error.ErrorMessage);
                }
            }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                logger.LogWarning(
                    "Cliente provisioning timed out for AuthUserId {AuthUserId}. Attempt {Attempt}/{MaxAttempts}",
                    request.AuthUserId,
                    attempt,
                    maxAttempts);

                if (attempt == maxAttempts)
                {
                    return ClienteProvisioningResult.Failure(
                        (int)HttpStatusCode.RequestTimeout,
                        attempt,
                        "IDENTITY_PROVISIONING_TIMEOUT",
                        "The provisioning request timed out");
                }
            }
            catch (HttpRequestException exception)
            {
                logger.LogWarning(
                    exception,
                    "Cliente provisioning network failure for AuthUserId {AuthUserId}. " +
                    "Attempt {Attempt}/{MaxAttempts}",
                    request.AuthUserId,
                    attempt,
                    maxAttempts);

                if (attempt == maxAttempts)
                {
                    return ClienteProvisioningResult.Failure(
                        null,
                        attempt,
                        "IDENTITY_PROVISIONING_NETWORK_ERROR",
                        exception.Message);
                }
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                logger.LogError(
                    exception,
                    "Unexpected Cliente provisioning failure for AuthUserId {AuthUserId} on Attempt {Attempt}",
                    request.AuthUserId,
                    attempt);

                return ClienteProvisioningResult.Failure(
                    null,
                    attempt,
                    "IDENTITY_PROVISIONING_UNEXPECTED_ERROR",
                    exception.Message);
            }

            await Task.Delay(GetRetryDelay(attempt), cancellationToken);
        }

        return ClienteProvisioningResult.Failure(
            null,
            maxAttempts,
            "IDENTITY_PROVISIONING_FAILED",
            "Cliente provisioning failed");
    }

    private TimeSpan GetRetryDelay(int attempt)
    {
        var baseDelay = Math.Max(0, _options.RetryDelayMilliseconds);
        return TimeSpan.FromMilliseconds(baseDelay * Math.Pow(2, attempt - 1));
    }

    private static bool IsTransient(HttpStatusCode statusCode) =>
        statusCode is HttpStatusCode.RequestTimeout or HttpStatusCode.TooManyRequests ||
        (int)statusCode >= 500;

    private static (string? ErrorCode, string? ErrorMessage) DeserializeError(string responseBody)
    {
        try
        {
            using var document = JsonDocument.Parse(responseBody);
            var root = document.RootElement;
            var errorCode = root.TryGetProperty("code", out var code) ? code.GetString() : null;
            var errorMessage = root.TryGetProperty("message", out var message) ? message.GetString() : null;
            return (errorCode, errorMessage);
        }
        catch (JsonException)
        {
            return (null, responseBody);
        }
    }
}
