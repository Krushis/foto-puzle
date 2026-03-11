using System.ComponentModel.DataAnnotations;

namespace FotoPuzleBackend.Models.Entities
{
    public enum PhotoStatus { Pending, Uploaded, Processing, Ready, Failed }

    public class Photo
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [Required, MaxLength(255)]
        public string OriginalFilename { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        public string StoredFilename { get; set; } = string.Empty;

        [Required]
        public string FilePath { get; set; } = string.Empty;

        public long? FileSizeBytes { get; set; }

        [MaxLength(50)]
        public string MimeType { get; set; } = "image/jpeg";

        public PhotoStatus Status { get; set; } = PhotoStatus.Pending;
        public DateTime? UploadedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public User User { get; set; } = null!;
        public ICollection<Puzzle> Puzzles { get; set; } = new List<Puzzle>();
    }
}
