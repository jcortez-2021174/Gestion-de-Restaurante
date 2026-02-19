using AuthService.Domain.Entities;
using GestorRestaurante.Application.DTOs;
using GestorRestaurante.Application.Interfaces;
using GestorRestaurante.Domain.Interfaces;

namespace GestorRestaurante.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserResponseDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();

            return users.Select(u => new UserResponseDto
            {
                IdUsuario = u.IdUsuario,
                Nombre = u.Nombre,
                Correo = u.Correo,
                Rol = u.Rol?.Nombre ?? "",
                Estado = u.Estado
            }).ToList();
        }

        public async Task<UserResponseDto?> GetByIdAsync(int idUsuario)
        {
            var u = await _userRepository.GetByIdAsync(idUsuario);
            if (u == null) return null;

            return new UserResponseDto
            {
                IdUsuario = u.IdUsuario,
                Nombre = u.Nombre,
                Correo = u.Correo,
                Rol = u.Rol?.Nombre ?? "",
                Estado = u.Estado
            };
        }
    }
}

        
