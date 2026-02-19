namespace GestorRestaurante.Application.DTOs
{
    public class RegisterUserDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty;
        public int IdRol { get; set; }
    }
}
