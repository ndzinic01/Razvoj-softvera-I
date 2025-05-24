using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using System.Linq;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteFromCartEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeleteFromCartEndpoint (ApplicationDbContext context)
        {
            _context = context;
        }

        // DELETE: api/Korpa/{proizvodId}/{korisnikId}
        [HttpDelete("{productId}/{myAppUserId}")]
        public async Task<IActionResult> DeleteFromCart(int productId, int myAppUserId)
        {
            var cart = await _context.Carts
                .Where(c => c.MyAppUserId == myAppUserId && c.Status)
                .FirstOrDefaultAsync(c => c.Id == productId);

            if (cart == null)
            {
                return NotFound("The product with the given Id was not found in the user's cart.");
            }

            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

