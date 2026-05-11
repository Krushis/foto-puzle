namespace FotoPuzleBackend.Models.Entities
{
    public class PuzzleLike
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public int PuzzleId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public Puzzle Puzzle { get; set; } = null!;
    }
}