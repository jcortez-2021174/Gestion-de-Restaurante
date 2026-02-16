using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.DTOs;
using RestaurantAPI.Services;
using System.Security.Claims;
 
namespace RestaurantAPI.Controllers;
 
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
 
    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }
 
    /// <summary>
    /// Registrar un nuevo usuario
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            var response = await _authService.RegisterAsync(registerDto);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al registrar usuario");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
 
    /// <summary>
    /// Iniciar sesión
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var response = await _authService.LoginAsync(loginDto);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al iniciar sesión");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
 
    /// <summary>
    /// Obtener información del usuario actual
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Token inválido" });
            }
 
            var userId = int.Parse(userIdClaim);
            var user = await _authService.GetCurrentUserAsync(userId);
 
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }
 
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener usuario actual");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
 
    /// <summary>
    /// Validar token JWT
    /// </summary>
    [HttpGet("validate")]
    [Authorize]
    public IActionResult ValidateToken()
    {
        return Ok(new { message = "Token válido", isValid = true });
    }
}