using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models.Auth;

namespace NewPharmacy.Endpoints.AuthEndpoint
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthRegisterEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthRegisterEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterUserDTO request)
        {

            var existingUser = await _context.MyAppUsers
                .FirstOrDefaultAsync(x => x.Username == request.Username);

            if (existingUser != null)
                return BadRequest("Username already exists");

            var newUser = new MyAppUser
            {
                Username = request.Username,
                Password = request.Password, 
                FirstName = request.FirstName,
                LastName = request.LastName,
                IsCustomer = true, // default role
                IsAdmin = false,
                IsPharmacist = false
            };

            _context.MyAppUsers.Add(newUser);
            await _context.SaveChangesAsync();

            //return Ok("Registracija uspješna.");
            return Ok(new
            {
                id = newUser.ID,
                username = newUser.Username,
                firstName = newUser.FirstName,
                lastName = newUser.LastName
            });


        }

    }
}
