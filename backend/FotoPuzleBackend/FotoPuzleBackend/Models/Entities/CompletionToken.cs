namespace FotoPuzleBackend.Models.Entities
{
    public class CompletionToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PuzzleId { get; set; }
        public string Token { get; set; } = string.Empty; // will be GUID
        public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public Puzzle Puzzle { get; set; } = null!;
    }
}
