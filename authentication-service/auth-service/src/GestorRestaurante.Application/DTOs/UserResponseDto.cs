namespace GestorRestaurante.Application.DTOs
{
    public class UserResponseDto
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public bool Estado { get; set; }
    }
}
