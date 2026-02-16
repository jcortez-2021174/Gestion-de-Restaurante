using System;
using AuthService.Domain.Entities;
using AuthService.Domain.Constants;
using AuthService.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthService.Persistence
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (!context.Roles.Any())
            {
                var roles = new List<Rol>
                {
                    new Rol
                    {
                        Nombre = RoleConstants.ADMIN_ROLE
                    },
                    new Rol
                    {
                        Nombre = RoleConstants.USER_ROLE
                    },
                    new Rol
                    {
                        Nombre = RoleConstants.MESERO_ROLE
                    },
                    new Rol
                    {
                        Nombre = RoleConstants.COCINERO_ROLE
                    }
                };
                await context.Roles.AddRangeAsync(roles);
                await context.SaveChangesAsync();
            }

            if (!await context.Usuarios.AnyAsync())
            {
                var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Nombre == RoleConstants.ADMIN_ROLE);
                if (adminRole != null)
                {
                    // var passwordHasher = new PasswordHashService(); // Assuming local BCrypt usage
                    
                    var adminUser = new Usuario
                    {
                        Nombre = "Administrador",
                        Correo = "admin@local.com",
                        Contrasena = BCrypt.Net.BCrypt.HashPassword("Kinal2026!"),
                        Estado = true,
                        IdRol = adminRole.IdRol
                    };
                    
                    await context.Usuarios.AddAsync(adminUser);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
