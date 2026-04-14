using FotoPuzleBackend.Data;
using FotoPuzleBackend.Models.DTO;
using FotoPuzleBackend.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FotoPuzleBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrderController> _logger;

        public OrderController(AppDbContext context, ILogger<OrderController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var puzzle = await _context.Puzzles
                .Include(p => p.Photo)
                .FirstOrDefaultAsync(p => p.Id == dto.PuzzleId);

            if (puzzle == null)
            {
                return NotFound(new { message = "Puzzle not found" });
            }

            var order = new Order
            {
                UserId = dto.UserId,
                PuzzleId = dto.PuzzleId,
                FullName = dto.FullName,
                CardNumber = dto.CardNumber,
                Expiration = dto.Expiration,
                Cvv = dto.Cvv,
                Amount = 19.99m,
                Status = OrderStatus.Paid,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order {OrderId} created for user {UserId}, puzzle {PuzzleId}",
                order.Id, dto.UserId, dto.PuzzleId);

            return Ok(new
            {
                message = "Uþsakymas sëkmingai pateiktas",
                orderId = order.Id
            });
        }
    }
}