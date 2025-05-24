using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data; // Importuj DataContext

namespace NewPharmacy.Endpoints
{
    // Kontroler za rad s brendovima
    [ApiController]
    [Route("api/products/brands")]
    public class BrandsController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // Podrazumevani kontekst

        public BrandsController(ApplicationDbContext context)
        {
            _context = context; // Injektovanje konteksta
        }

        // Endpoint za dohvat brendova
        [HttpGet("products/brands")]
        public IActionResult GetBrands()
        {
            var brands = _context.Brands
                .Select(b => new
                {
                    b.Id,
                    b.Name,
                    b.LogoUrl,
                    b.Description
                })
                .ToList();

            return Ok(brands);
        }
    }
}
