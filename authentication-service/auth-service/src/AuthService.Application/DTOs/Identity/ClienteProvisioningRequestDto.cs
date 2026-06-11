using System.Text.Json.Serialization;

namespace AuthService.Application.DTOs.Identity;

public sealed class ClienteProvisioningRequestDto
{
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
