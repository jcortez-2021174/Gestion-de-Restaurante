using AuthService.Application.DTOs.Identity;

namespace AuthService.Application.Interfaces;

public interface IClienteProvisioningClient
{
    Task<ClienteProvisioningResult> ProvisionAsync(
        ClienteProvisioningRequestDto request,
        CancellationToken cancellationToken = default);
}
