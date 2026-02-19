using System.Collections.Generic;
using System.Threading.Tasks;
using AuthService.Domain.Entities;

namespace GestorRestaurante.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<Usuario?> GetByIdAsync(int idUsuario);
        Task<Usuario?> GetByCorreoAsync(string correo);
        Task<List<Usuario>> GetAllAsync();
        Task<Usuario> CreateAsync(Usuario usuario);
        Task<Usuario> UpdateAsync(Usuario usuario);
        Task<bool> DeleteAsync(int idUsuario);
    }
}
