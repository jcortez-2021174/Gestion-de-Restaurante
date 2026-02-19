namespace GestorRestaurante.Application.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserResponseDto Usuario { get; set; } = new();
    }
}
