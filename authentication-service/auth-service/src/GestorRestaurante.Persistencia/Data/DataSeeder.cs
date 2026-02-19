
using AuthService.Domain.Entities;
using AuthService.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext db)
        {
            if (!await db.Roles.AnyAsync())
            {
                db.Roles.AddRange(
                    new Rol { Nombre = "ADMIN" },
                    new Rol { Nombre = "USER" }
                );

                await db.SaveChangesAsync();
            }
        }
    }
}
