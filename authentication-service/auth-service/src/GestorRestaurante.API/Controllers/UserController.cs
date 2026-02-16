using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.DTOs;
using RestaurantAPI.Services;
using System.Security.Claims;
 
namespace RestaurantAPI.Controllers;
 
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;
 
    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }
 
    /// <summary>
    /// Obtener todos los usuarios (solo Admin)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener usuarios");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
 
    /// <summary>
    /// Obtener usuario por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUserById(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
 
            // Solo admin puede ver otros usuarios, o el usuario puede verse a sí mismo
            if (currentUserRole != "Admin" && currentUserId != id)
            {
                return Forbid();
            }
 
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }
 
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener usuario");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
 
    /// <summary>
    /// Actualizar usuario
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UpdateUserDto updateDto)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
 
            // Solo admin puede actualizar otros usuarios, o el usuario puede actualizarse a sí mismo
            if (currentUserRole != "Admin" && currentUserId != id)
            {
                return Forbid();
            }
 
            var updatedUser = await _userService.UpdateUserAsync(id, updateDto);
            return Ok(updatedUser);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar usuario");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
 
    /// <summary>
    /// Eliminar usuario (solo Admin)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
           
            // No permitir que el admin se elimine a sí mismo
            if (currentUserId == id)
            {
                return BadRequest(new { message = "No puedes eliminar tu propia cuenta" });
            }
 
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }
 
            return Ok(new { message = "Usuario eliminado exitosamente" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar usuario");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
 
    /// <summary>
    /// Cambiar contraseña
    /// </summary>
    [HttpPost("{id}/change-password")]
    public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto changePasswordDto)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
 
            // Solo el usuario puede cambiar su propia contraseña
            if (currentUserId != id)
            {
                return Forbid();
            }
 
            await _userService.ChangePasswordAsync(id, changePasswordDto);
            return Ok(new { message = "Contraseña actualizada exitosamente" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al cambiar contraseña");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
 
    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }
}