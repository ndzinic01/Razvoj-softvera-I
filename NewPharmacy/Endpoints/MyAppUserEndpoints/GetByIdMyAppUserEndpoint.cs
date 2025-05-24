using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Data.Models.Auth;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetMyAppUserByIdEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetMyAppUserByIdEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public IActionResult GetMyAppUserById(int id)
        {
            var myAppUser = _context.MyAppUsers.FirstOrDefault(u => u.ID == id);

            if (myAppUser == null)
                return NotFound($"App user with Id {id} not found.");

            return Ok(myAppUser);
        }
    }
}


