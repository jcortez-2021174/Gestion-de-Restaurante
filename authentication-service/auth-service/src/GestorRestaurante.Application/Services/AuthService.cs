using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Domain.Entities;
using BCrypt.Net;
using GestorRestaurante.Application.Configuration;
using GestorRestaurante.Application.DTOs;
using GestorRestaurante.Application.Interfaces;
using GestorRestaurante.Domain.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace GestorRestaurante.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly JwtSettings _jwt;

        public AuthService(IUserRepository users, JwtSettings jwt)
        {
            _users = users;
            _jwt = jwt;
        }

        public async Task<UserResponseDto> RegisterAsync(RegisterUserDto dto)
        {
            var correo = dto.Correo.Trim().ToLower();

            var existing = await _users.GetByCorreoAsync(correo);
            if (existing != null)
                throw new Exception("El correo ya está registrado.");

            if (string.IsNullOrWhiteSpace(dto.Contrasena) || dto.Contrasena.Length < 6)
                throw new Exception("La contraseña debe tener al menos 6 caracteres.");

            var usuario = new Usuario
            {
                Nombre = dto.Nombre.Trim(),
                Correo = correo,
                Contrasena = BCrypt.Net.BCrypt.HashPassword(dto.Contrasena),
                Estado = true,
                IdRol = dto.IdRol
            };

            var created = await _users.CreateAsync(usuario);

            return new UserResponseDto
            {
                IdUsuario = created.IdUsuario,
                Nombre = created.Nombre,
                Correo = created.Correo,
                Rol = created.Rol?.Nombre ?? "USER",
                Estado = created.Estado
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var correo = dto.Correo.Trim().ToLower();
            var usuario = await _users.GetByCorreoAsync(correo);

            if (usuario == null)
                throw new Exception("Credenciales inválidas.");

            if (!usuario.Estado)
                throw new Exception("Usuario inactivo.");

            var ok = BCrypt.Net.BCrypt.Verify(dto.Contrasena, usuario.Contrasena);
            if (!ok)
                throw new Exception("Credenciales inválidas.");

            var rolNombre = usuario.Rol?.Nombre ?? "USER";
            var (token, exp) = GenerateToken(usuario, rolNombre);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = exp,
                Usuario = new UserResponseDto
                {
                    IdUsuario = usuario.IdUsuario,
                    Nombre = usuario.Nombre,
                    Correo = usuario.Correo,
                    Rol = rolNombre,
                    Estado = usuario.Estado
                }
            };
        }

        private (string token, DateTime expiresAt) GenerateToken(Usuario usuario, string rolNombre)
        {
            if (string.IsNullOrWhiteSpace(_jwt.Secret) || _jwt.Secret.Length < 32)
                throw new Exception("JwtSettings.Secret inválido (mínimo 32 caracteres).");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(_jwt.ExpirationInMinutes);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, usuario.IdUsuario.ToString()),
                new(JwtRegisteredClaimNames.UniqueName, usuario.Nombre),
                new(ClaimTypes.Email, usuario.Correo),
                new(ClaimTypes.Role, rolNombre)
            };

            var token = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expires);
        }
    }
}
