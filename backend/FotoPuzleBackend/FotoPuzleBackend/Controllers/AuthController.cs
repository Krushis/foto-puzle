using FotoPuzleBackend.DTO;
using Microsoft.AspNetCore.Mvc;

namespace FotoPuzleBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO loginDto)
        {
            if (loginDto.Email == "admin@foto.lt" && loginDto.Password == "123456")
            {
                return Ok(new
                {
                    message = "Prisijungimas sëkmingas",
                    user = new
                    {
                        email = loginDto.Email,
                        name = "Admin"
                    }
                });
            }

            return Unauthorized(new { message = "Neteisingas el. paðtas arba slaptaþodis" });
        }
    }
}