using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PharmacistDashboardEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PharmacistDashboardEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // Endpoint za dohvat profila farmaceuta
        [HttpGet("pharmacist-profile")]
        [Authorize]
        public async Task<IActionResult> GetPharmacistProfile()
        {
            // Dohvati korisničko ime iz claimova
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized("Nema prijavljenog korisnika.");
            }

            // Dohvati farmaceuta prema korisničkom imenu i provjeri da li je farmaceut
            var pharmacist = await _context.MyAppUsers
                .Where(x => x.Username == username && x.IsPharmacist)
                .Select(x => new
                {
                    x.Username,
                    x.FirstName,
                    x.LastName,
                    x.Email,
                    x.EmploymentDate,
                    x.ProfileImageUrl,
                    x.IsAdmin,
                    x.IsPharmacist,
                    x.IsCustomer
                })
                .FirstOrDefaultAsync();

            if (pharmacist == null)
            {
                return NotFound("Farmaceut nije pronađen ili korisnik nije farmaceut.");
            }

            return Ok(pharmacist);
        }
    }
}

