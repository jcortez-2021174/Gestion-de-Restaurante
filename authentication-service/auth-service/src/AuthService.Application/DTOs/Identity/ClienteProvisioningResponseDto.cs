using System.Text.Json.Serialization;

namespace AuthService.Application.DTOs.Identity;

public sealed class ClienteProvisioningResponseDto
{
    [JsonPropertyName("success")]
    public bool Success { get; init; }

    [JsonPropertyName("data")]
    public ClienteIdentityDto? Data { get; init; }
}

public sealed class ClienteIdentityDto
{
    [JsonPropertyName("id")]
    public string Id { get; init; } = string.Empty;

    [JsonPropertyName("authUserId")]
    public string AuthUserId { get; init; } = string.Empty;

    [JsonPropertyName("nombre")]
    public string Nombre { get; init; } = string.Empty;

    [JsonPropertyName("apellido")]
    public string Apellido { get; init; } = string.Empty;

    [JsonPropertyName("correo")]
    public string Correo { get; init; } = string.Empty;

    [JsonPropertyName("telefono")]
    public string Telefono { get; init; } = string.Empty;
}
