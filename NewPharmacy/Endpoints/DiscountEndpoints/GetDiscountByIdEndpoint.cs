using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetDiscountByIdEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetDiscountByIdEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Popusti/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Discount>> GetDiscountById(int id)
        {
            var discount = await _context.Discounts
                .Include(d => d.Product)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (discount == null)
            {
                return NotFound($"Discount with ID {id} not found.");
            }

            return Ok(discount);
        }
    }
}
