using GestorRestaurante.Application.DTOs;

namespace GestorRestaurante.Application.Interfaces
{
    public interface IUserService
    {
        Task<List<UserResponseDto>> GetAllAsync();
        Task<UserResponseDto?> GetByIdAsync(int idUsuario);
    }
}
