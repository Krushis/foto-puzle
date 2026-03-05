using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FotoPuzleBackend.Controllers
{
    // Example of controller for future development, can later make userController, systemController classes
    // through this we connect backend to frontend by calling API

    [Route("api/[controller]")]
    [ApiController]
    public class ExampleController : ControllerBase
    {
        [HttpGet("registration")]
        public string Get()
        {
            return "Yes";
        }
    }
}
