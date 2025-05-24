using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetDiscountEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetDiscountEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Popusti
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Discount>>> GetDiscount()
        {
            var discounts = await _context.Discounts
                .Include(d => d.Product)
                .ToListAsync();

            if (discounts == null || !discounts.Any())
            {
                return NotFound("No discounts found.");
            }

            return Ok(discounts);
        }
    }
}