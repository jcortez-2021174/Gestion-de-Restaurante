using AuthService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Rol> Roles { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>().ToTable("usuarios");
            modelBuilder.Entity<Rol>().ToTable("roles");

            // Relación Usuarios -> Roles
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Rol)
                .WithMany(r => r.Usuarios)
                .HasForeignKey(u => u.IdRol)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(u => u.IdUsuario);

                entity.Property(u => u.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Correo).IsRequired().HasMaxLength(150);
                entity.Property(u => u.Contrasena).IsRequired().HasMaxLength(255);
                entity.Property(u => u.Estado).HasDefaultValue(true);

                entity.HasIndex(u => u.Correo).IsUnique();
            });

            modelBuilder.Entity<Rol>(entity =>
            {
                entity.HasKey(r => r.IdRol);
                entity.Property(r => r.Nombre).IsRequired().HasMaxLength(50);
                entity.HasIndex(r => r.Nombre).IsUnique();
            });
        }
    }
}
