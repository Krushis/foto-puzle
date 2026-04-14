namespace FotoPuzleBackend.Models.DTO
{
    public class CreateOrderDTO
    {
        public int UserId { get; set; }
        public int PuzzleId { get; set; }

        public string FullName { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string Expiration { get; set; } = string.Empty;
        public string Cvv { get; set; } = string.Empty;
    }
}