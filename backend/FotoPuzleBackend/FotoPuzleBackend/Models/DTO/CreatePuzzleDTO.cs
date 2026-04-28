namespace FotoPuzleBackend.Models.DTO
{
    public class CreatePuzzleDTO
    {
        public int UserId { get; set; }
        public int PieceCount { get; set; }
        public string AspectRatio { get; set; } = "1:1";
        public string? OriginalFilename { get; set; }
        public IFormFile Image { get; set; } = null!;
        public bool IsPublic { get; set; } = false;
    }
}