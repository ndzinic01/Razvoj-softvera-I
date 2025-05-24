using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PutDiscountEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PutDiscountEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/Popusti/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDiscount(int id, Discount discount)
        {
            if (id != discount.Id)
            {
                return BadRequest("Discount ID mismatch.");
            }

            _context.Entry(discount).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DiscountExists(id))
                {
                    return NotFound($"Discount with ID {id} not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Success response with no content
        }

        private bool DiscountExists(int id)
        {
            return _context.Discounts.Any(d => d.Id == id);
        }
    }
}