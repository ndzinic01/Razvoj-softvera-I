using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Data.Models.Auth;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostMyAppUserEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostMyAppUserEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult PostMyAppUser([FromBody] MyAppUser myAppUser)
        {
            if (string.IsNullOrWhiteSpace(myAppUser.Username) || string.IsNullOrWhiteSpace(myAppUser.Password))
                return BadRequest("The App User must have a username and password.");

            _context.MyAppUsers.Add(myAppUser);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMyAppUserByIdEndpoint), new { id = myAppUser.ID }, myAppUser);
        }
    }
}
