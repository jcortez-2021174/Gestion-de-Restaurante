using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace AuthService.Application.Services;

public class JwtTokenService(IConfiguration configuration, IUserRepository userRepository) : IJwtTokenService
{
    public string GenerateToken(User user)
    {
        var secretKey =
            Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? throw new InvalidOperationException("JWT_SECRET no configurado");

        var issuer =
            Environment.GetEnvironmentVariable("JWT_ISSUER")
            ?? "AuthService.Api";

        var audience =
            Environment.GetEnvironmentVariable("JWT_AUDIENCE")
            ?? "GestorRestaurante.Clients";

        var expiryInMinutes = 30;

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secretKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var role = user.UserRoles?.FirstOrDefault()?.Role?.Name
            ?? "USER_ROLE";

        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(
            JwtRegisteredClaimNames.Iat,
            DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
            ClaimValueTypes.Integer64
        ),
        new Claim("role", role)
    };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<string> GenerateTokenAsync(
        string userId,
        int expiresInMinutes = 15)
    {
        var user = await userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            throw new UnauthorizedAccessException(
                "Usuario no encontrado para generación de token");
        }

        var secretKey =
            Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? throw new InvalidOperationException("JWT_SECRET no configurado");

        var issuer =
            Environment.GetEnvironmentVariable("JWT_ISSUER")
            ?? "AuthService.Api";

        var audience =
            Environment.GetEnvironmentVariable("JWT_AUDIENCE")
            ?? "GestorRestaurante.Clients";

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secretKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var role = user.UserRoles?.FirstOrDefault()?.Role?.Name
            ?? "USER_ROLE";

        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(
            JwtRegisteredClaimNames.Iat,
            DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
            ClaimValueTypes.Integer64
        ),
        new Claim("role", role)
    };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
