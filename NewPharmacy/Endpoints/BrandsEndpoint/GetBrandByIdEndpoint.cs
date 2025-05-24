using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;

namespace NewPharmacy.Endpoints.BrandsEndpoint
{
    [Route("api")]
    [ApiController]
    public class GetBrandByIdEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetBrandByIdEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("brands/{id}")]
        public IActionResult GetBrandById(int id)
        {
            var brand = _context.Brands
                .Where(b => b.Id == id)
                .Select(b => new {
                    b.Id,
                    b.Name,
                    b.LogoUrl,
                    b.Description,
                })
                .FirstOrDefault();

            if (brand == null)
                return NotFound();

            return Ok(brand);
        }

    }
}
