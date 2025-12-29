using System.ComponentModel.DataAnnotations;

namespace CodeMart.Server.DTOs.User
{
    public class AuthResponseDto
    {
        [Required]
        public string Token { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        [Required]
        public UserDtoOut User { get; set; } = default!;
    }
}

