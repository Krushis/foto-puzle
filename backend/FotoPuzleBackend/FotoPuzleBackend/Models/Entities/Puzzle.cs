namespace FotoPuzleBackend.Models.Entities
{
    // can later change these values, by updating tables with EF Core, see backend README for more information

    public enum DifficultyLevel { Easy, Medium, Hard, Expert }
    public enum PuzzleStatus { Pending, Generating, Ready, Failed }

    public class Puzzle
    {
        public int Id { get; set; }
        public int PhotoId { get; set; }
        public int UserId { get; set; }

        public DifficultyLevel Difficulty { get; set; } = DifficultyLevel.Medium;
        public int PieceCount { get; set; }
        public PuzzleStatus Status { get; set; } = PuzzleStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public Photo Photo { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
