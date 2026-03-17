namespace FotoPuzleBackend.Models.DTO
{
    public class UserProfileDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int TotalPhotos { get; set; }
        public int TotalPuzzles { get; set; }
    }
}
