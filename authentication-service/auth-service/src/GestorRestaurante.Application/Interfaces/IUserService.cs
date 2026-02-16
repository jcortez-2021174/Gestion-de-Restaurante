using AuthService.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AuthService.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto> RegisterUserAsync(RegisterUserDto registerUserDto);
        Task<UserResponseDto> LoginAsync(LoginDto loginDto);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto> GetUserByIdAsync(int id);
    }
}
