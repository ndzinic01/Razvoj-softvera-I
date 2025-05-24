using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostDiscountEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostDiscountEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Popusti
        [HttpPost]
        public async Task<ActionResult<Discount>> PostDiscount(Discount discount)
        {
            if (discount == null)
            {
                return BadRequest("Invalid discount data.");
            }

            // Add the new discount to the database
            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync();

            // Return a response indicating success
            return CreatedAtAction(nameof(GetDiscountByIdEndpoint), new { id = discount.Id }, discount);
        }
    }
}