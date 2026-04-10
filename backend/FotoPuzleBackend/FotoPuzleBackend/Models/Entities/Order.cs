namespace FotoPuzleBackend.Models.Entities
{
    public enum OrderStatus
    {
        Pending,
        Paid,
        Completed
    }

    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PuzzleId { get; set; }

        public string FullName { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string Expiration { get; set; } = string.Empty;
        public string Cvv { get; set; } = string.Empty;

        public decimal Amount { get; set; } = 19.99m;
        public OrderStatus Status { get; set; } = OrderStatus.Paid;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public Puzzle Puzzle { get; set; } = null!;
    }
}