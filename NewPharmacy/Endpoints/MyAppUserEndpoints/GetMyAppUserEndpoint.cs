using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Services;
using System.Linq;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetMyAppUserEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly MyAuthService _authService;
        public GetMyAppUserEndpoint(ApplicationDbContext context, MyAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        // GET /api/GetMyAppUser - Dohvati sve korisnike
        [HttpGet]
        public IActionResult GetMyAppUser()
        {
            var myAppUsers = _context.MyAppUsers.ToList();
            return Ok(myAppUsers);
        }

        // GET /api/GetMyAppUser/pharmacist - Dohvati podatke samo za farmaceute
        [HttpGet("pharmacist")]
        public IActionResult GetPharmacistData()
        {
            var pharmacists = _context.MyAppUsers
                                    .Where(u => u.IsPharmacist)  // Pretpostavljamo da imamo polje IsPharmacist za identifikaciju farmaceuta
                                    .ToList();

            if (pharmacists == null || pharmacists.Count == 0)
            {
                return NotFound(new { Message = "Nema farmaceuta u bazi podataka." });
            }

            return Ok(pharmacists);
        }

        [HttpGet("pharmacist/{id}")]
        public IActionResult GetPharmacistWithDashboard(int id)
        {
            var pharmacist = _context.MyAppUsers
                .Where(u => u.IsPharmacist && u.ID == id)
                .Select(u => new
                {
                    u.ID,
                    u.Username,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.EmploymentDate,
                    u.ProfileImageUrl
                })
                .FirstOrDefault();

            if (pharmacist == null)
            {
                return NotFound(new { Message = "Farmaceut nije pronađen." });
            }

            var today = DateTime.Today;

            var totalMedications = _context.Products.Count();
            var expiringSoon = _context.Products.Count(p => p.ExpiryDate <= today.AddDays(30));
            var lowStock = _context.Products.Count(p => p.QuantityInStock < 10);

            return Ok(new
            {
                Pharmacist = pharmacist,
                Dashboard = new
                {
                    TotalMedications = totalMedications,
                    ExpiringSoon = expiringSoon,
                    LowStock = lowStock
                }
            });
        }
       
        [HttpGet("pharmacist/dashboard")]
        public IActionResult GetLoggedInPharmacistProfile()
        {
            var userId = _authService.GetLoggedInUserId();
            if (userId == null)
                return Unauthorized(new { message = "Korisnik nije autentificiran." });

            var pharmacist = _context.MyAppUsers
                .FirstOrDefault(x => x.ID == userId && x.IsPharmacist);

            if (pharmacist == null)
                return NotFound(new { message = "Farmaceut nije pronađen." });

            return Ok(new
            {
                pharmacist.FirstName,
                pharmacist.LastName,
                pharmacist.Username,
                pharmacist.Email,
                pharmacist.ProfileImageUrl,
                pharmacist.EmploymentDate
            });
        }

    }
}
