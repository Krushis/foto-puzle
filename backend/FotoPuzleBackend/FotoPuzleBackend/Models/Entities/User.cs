using System.ComponentModel.DataAnnotations;
using FotoPuzleBackend.Models.Enums;

namespace FotoPuzleBackend.Models.Entities
{
    /// <summary>
    /// Represents a user within the system
    /// </summary>
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.User;

        //[MaxLength(20)]
        //public string? Phone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
        public ICollection<Puzzle> Puzzles { get; set; } = new List<Puzzle>();
    }
}
