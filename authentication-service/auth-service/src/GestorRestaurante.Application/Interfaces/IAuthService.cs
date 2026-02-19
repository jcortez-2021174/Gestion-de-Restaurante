using GestorRestaurante.Application.DTOs;

namespace GestorRestaurante.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<UserResponseDto> RegisterAsync(RegisterUserDto dto);
    }
}
