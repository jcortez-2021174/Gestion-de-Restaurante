namespace AuthService.Application.DTOs.Identity;

public sealed record ClienteProvisioningResult(
    bool Succeeded,
    int? StatusCode,
    int Attempts,
    ClienteIdentityDto? Cliente = null,
    string? ErrorCode = null,
    string? ErrorMessage = null)
{
    public static ClienteProvisioningResult Success(
        int statusCode,
        int attempts,
        ClienteIdentityDto cliente) =>
        new(true, statusCode, attempts, cliente);

    public static ClienteProvisioningResult Failure(
        int? statusCode,
        int attempts,
        string? errorCode,
        string? errorMessage) =>
        new(false, statusCode, attempts, null, errorCode, errorMessage);
}
