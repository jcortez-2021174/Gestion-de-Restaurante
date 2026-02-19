using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthService.Domain.Entities;
using AuthService.Persistence.Context;
using GestorRestaurante.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GestorRestaurante.Persistencia.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> GetByIdAsync(int idUsuario)
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);
        }

        public async Task<Usuario?> GetByCorreoAsync(string correo)
        {
            var norm = correo.Trim().ToLower();
            return await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Correo.ToLower() == norm);
        }

        public async Task<List<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .OrderBy(u => u.Nombre)
                .ToListAsync();
        }

        public async Task<Usuario> CreateAsync(Usuario usuario)
        {
            usuario.Correo = usuario.Correo.Trim().ToLower();
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario> UpdateAsync(Usuario usuario)
        {
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<bool> DeleteAsync(int idUsuario)
        {
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);
            if (user == null) return false;

            _context.Usuarios.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
