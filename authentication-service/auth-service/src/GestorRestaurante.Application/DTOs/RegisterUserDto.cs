using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs
{
    public class RegisterUserDto
    {
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Correo { get; set; }

        [Required]
        [MaxLength(50)]
        public string Contrasena { get; set; }

        [Required]
        public int IdRol { get; set; }
    }
}
