using AuthService.Domain.Entities;


namespace AuthService.Persistence.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }


        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relación Usuarios -> Roles
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Rol)
                .WithMany(r => r.Usuarios)
                .HasForeignKey(u => u.IdRol)
                .OnDelete(DeleteBehavior.Restrict);

            
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(u => u.IdUsuario);
                entity.Property(u => u.Correo).IsRequired().HasMaxLength(150);
                entity.HasIndex(u => u.Correo).IsUnique(); 
            });

            
            modelBuilder.Entity<Rol>(entity =>
            {
                entity.HasKey(r => r.IdRol);
                entity.Property(r => r.Nombre).IsRequired().HasMaxLength(50);
            });
        }
    }
}
