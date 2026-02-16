namespace AuthService.Application.DTOs
{
    public class UserResponseDto
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public bool Estado { get; set; }
        public int IdRol { get; set; }
        public string RolNombre { get; set; }
    }
}
