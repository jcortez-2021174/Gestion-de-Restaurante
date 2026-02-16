using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using AuthService.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthService.Application.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserResponseDto> RegisterUserAsync(RegisterUserDto dto)
        {
            // Validar correo existente
            if (await _context.Usuarios.AnyAsync(u => u.Correo == dto.Correo))
            {
                throw new Exception("El correo ya está registrado.");
            }

            // Validar rol existente
            var rol = await _context.Roles.FindAsync(dto.IdRol);
            if (rol == null)
            {
                throw new Exception("El rol especificado no existe.");
            }

            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Correo = dto.Correo,
                Contrasena = BCrypt.Net.BCrypt.HashPassword(dto.Contrasena), // Hash de contraseña
                IdRol = dto.IdRol,
                Estado = true
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return MapToDto(usuario, rol.Nombre);
        }

        public async Task<UserResponseDto> LoginAsync(LoginDto dto)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Correo == dto.Correo);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Contrasena, usuario.Contrasena))
            {
                throw new Exception("Credenciales inválidas.");
            }

            if (!usuario.Estado)
            {
                throw new Exception("El usuario está inactivo.");
            }

            return MapToDto(usuario, usuario.Rol.Nombre);
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var usuarios = await _context.Usuarios
                .Include(u => u.Rol)
                .ToListAsync();

            return usuarios.Select(u => MapToDto(u, u.Rol?.Nombre));
        }

        public async Task<UserResponseDto> GetUserByIdAsync(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.IdUsuario == id);

            if (usuario == null)
            {
                return null;
            }

            return MapToDto(usuario, usuario.Rol?.Nombre);
        }

        private UserResponseDto MapToDto(Usuario usuario, string rolNombre)
        {
            return new UserResponseDto
            {
                IdUsuario = usuario.IdUsuario,
                Nombre = usuario.Nombre,
                Correo = usuario.Correo,
                Estado = usuario.Estado,
                IdRol = usuario.IdRol,
                RolNombre = rolNombre
            };
        }
    }
}
