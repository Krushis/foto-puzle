using Microsoft.AspNetCore.Mvc;
using FotoPuzleBackend.Models.DTO;

namespace FotoPuzleBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExampleController : ControllerBase
    {
        [HttpGet("registration")]
        public IActionResult Get()
        {
            return Ok(new { message = "Yes" });
        }

        [HttpPost("registration")]
        public IActionResult Register([FromBody] RegisterDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Neteisingi arba neužpildyti duomenys." });
            }

            return Ok(new
            {
                message = "Registracija sėkmingai gauta!",
                username = dto.Username,
                email = dto.Email,
                phone = dto.Phone
            });
        }
    }
}