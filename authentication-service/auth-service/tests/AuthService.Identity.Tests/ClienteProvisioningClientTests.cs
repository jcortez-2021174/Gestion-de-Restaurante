using System.Net;
using System.Text;
using System.Text.Json;
using AuthService.Api.Infrastructure.RestaurantApi;
using AuthService.Application.DTOs.Identity;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Xunit;

namespace AuthService.Identity.Tests;

public sealed class ClienteProvisioningClientTests
{
    [Fact]
    public async Task ProvisionAsync_SendsExactContractAndAcceptsCreatedResponse()
    {
        var handler = new RecordingHandler(
            JsonResponse(
                HttpStatusCode.Created,
                """
                {
                  "success": true,
                  "data": {
                    "id": "mongo-123",
                    "authUserId": "postgres-456",
                    "nombre": "Ana",
                    "apellido": "Lopez",
                    "correo": "ana@example.com",
                    "telefono": "55551234"
                  }
                }
                """));
        var client = CreateClient(handler);

        var result = await client.ProvisionAsync(CreateRequest());

        Assert.True(result.Succeeded);
        Assert.Equal("mongo-123", result.Cliente?.Id);
        Assert.Equal("postgres-456", result.Cliente?.AuthUserId);
        Assert.Equal(1, result.Attempts);
        Assert.Equal("test-provisioning-key", handler.LastApiKey);
        Assert.Equal(
            "/AureaRestaurant/Admin/v1/internal/identity/clientes/provision",
            handler.LastRequestUri?.AbsolutePath);

        using var payload = JsonDocument.Parse(handler.LastRequestBody!);
        Assert.Equal(
            ["authUserId", "nombre", "apellido", "correo", "telefono"],
            payload.RootElement.EnumerateObject().Select(property => property.Name).ToArray());
        Assert.Equal("postgres-456", payload.RootElement.GetProperty("authUserId").GetString());
    }

    [Fact]
    public async Task ProvisionAsync_RetriesTransientFailure()
    {
        var handler = new RecordingHandler(
            JsonResponse(
                HttpStatusCode.ServiceUnavailable,
                """{"success":false,"code":"TEMPORARY","message":"Unavailable"}"""),
            JsonResponse(
                HttpStatusCode.OK,
                """
                {
                  "success": true,
                  "data": {
                    "id": "mongo-123",
                    "authUserId": "postgres-456",
                    "nombre": "Ana",
                    "apellido": "Lopez",
                    "correo": "ana@example.com",
                    "telefono": "55551234"
                  }
                }
                """));
        var client = CreateClient(handler);

        var result = await client.ProvisionAsync(CreateRequest());

        Assert.True(result.Succeeded);
        Assert.Equal(2, result.Attempts);
        Assert.Equal(2, handler.CallCount);
    }

    [Fact]
    public async Task ProvisionAsync_DoesNotRetryIdentityConflict()
    {
        var handler = new RecordingHandler(
            JsonResponse(
                HttpStatusCode.Conflict,
                """
                {
                  "success": false,
                  "code": "IDENTITY_CONFLICT",
                  "message": "El correo ya pertenece a otra identidad"
                }
                """));
        var client = CreateClient(handler);

        var result = await client.ProvisionAsync(CreateRequest());

        Assert.False(result.Succeeded);
        Assert.Equal("IDENTITY_CONFLICT", result.ErrorCode);
        Assert.Equal(1, result.Attempts);
        Assert.Equal(1, handler.CallCount);
    }

    private static ClienteProvisioningClient CreateClient(RecordingHandler handler)
    {
        var httpClient = new HttpClient(handler)
        {
            BaseAddress = new Uri("http://restaurant.test"),
        };
        var options = Options.Create(new RestaurantApiOptions
        {
            BaseUrl = "http://restaurant.test",
            ProvisioningKey = "test-provisioning-key",
            MaxRetryAttempts = 3,
            RetryDelayMilliseconds = 0,
        });

        return new ClienteProvisioningClient(
            httpClient,
            options,
            NullLogger<ClienteProvisioningClient>.Instance);
    }

    private static ClienteProvisioningRequestDto CreateRequest() => new()
    {
        AuthUserId = "postgres-456",
        Nombre = "Ana",
        Apellido = "Lopez",
        Correo = "ana@example.com",
        Telefono = "55551234",
    };

    private static HttpResponseMessage JsonResponse(HttpStatusCode statusCode, string body) =>
        new(statusCode)
        {
            Content = new StringContent(body, Encoding.UTF8, "application/json"),
        };

    private sealed class RecordingHandler(params HttpResponseMessage[] responses) : HttpMessageHandler
    {
        private readonly Queue<HttpResponseMessage> _responses = new(responses);

        public int CallCount { get; private set; }
        public Uri? LastRequestUri { get; private set; }
        public string? LastRequestBody { get; private set; }
        public string? LastApiKey { get; private set; }

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            CallCount++;
            LastRequestUri = request.RequestUri;
            LastRequestBody = request.Content is null
                ? null
                : await request.Content.ReadAsStringAsync(cancellationToken);
            LastApiKey = request.Headers.TryGetValues("X-Internal-API-Key", out var values)
                ? values.Single()
                : null;

            return _responses.Dequeue();
        }
    }
}
