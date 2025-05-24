using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteDiscountEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeleteDiscountEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // DELETE: api/Popusti/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);

            if (discount == null)
            {
                return NotFound($"Discount with ID {id} not found.");
            }

            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();

            return NoContent(); // Success response with no content
        }
    }
}