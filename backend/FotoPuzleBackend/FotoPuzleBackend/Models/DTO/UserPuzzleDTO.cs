namespace FotoPuzleBackend.Models.DTO
{
    public class UserPuzzleDTO
    {
        public int PuzzleId { get; set; }
        public int PhotoId { get; set; }
        public string Difficulty { get; set; } = string.Empty;
        public int PieceCount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string OriginalFilename { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}