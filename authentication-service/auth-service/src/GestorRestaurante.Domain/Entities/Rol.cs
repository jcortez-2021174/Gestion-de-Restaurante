using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities
{
    public class Rol
    {
        [Key]
        public int IdRol { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; } = string.Empty;

        public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    }
}
