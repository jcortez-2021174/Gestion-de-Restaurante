namespace AuthService.Api.Infrastructure.RestaurantApi;

public sealed class RestaurantApiOptions
{
    public const string SectionName = "RestaurantApi";

    public string BaseUrl { get; set; } = string.Empty;
    public string ProvisioningKey { get; set; } = string.Empty;
    public int TimeoutSeconds { get; set; } = 10;
    public int MaxRetryAttempts { get; set; } = 3;
    public int RetryDelayMilliseconds { get; set; } = 200;
}
