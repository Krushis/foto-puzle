using System.ComponentModel.DataAnnotations;

namespace FotoPuzleBackend.Models.DTO
{
    public class RegisterDTO
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}