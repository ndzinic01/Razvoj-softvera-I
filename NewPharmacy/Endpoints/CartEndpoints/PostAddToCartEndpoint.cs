using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using System.Linq;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostAddToCartEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostAddToCartEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Korpa
        [HttpPost]
        public async Task<ActionResult<Cart>> PostAddToCart(Cart cart)
        {
            // Provjera da li korisnik postoji
            var myAppUser = await _context.MyAppUsers.FindAsync(cart.MyAppUserId);
            if (myAppUser == null)
            {
                return BadRequest("App User with this Id not found.");
            }

            // Kreiranje nove korpe
            cart.Date = DateTime.Now;
            cart.Status = true; // Aktivna korpa

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCartByMyAppUserIdEndpoint.GetCartByMyAppUserId), new { myAppUserId = cart.MyAppUserId }, cart);
        }
    }
}

