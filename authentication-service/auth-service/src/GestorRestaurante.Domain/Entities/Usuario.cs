using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Domain.Entities
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Correo { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Contrasena { get; set; } = string.Empty;

        public bool Estado { get; set; } = true;

        [Required]
        public int IdRol { get; set; }

        [ForeignKey(nameof(IdRol))]
        public virtual Rol Rol { get; set; } = null!;
    }
}
