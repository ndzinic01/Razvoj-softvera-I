using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using NewPharmacy.Data.Models.Auth;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetCartByMyAppUserIdEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetCartByMyAppUserIdEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Korpa/{korisnikId}
        [HttpGet("{myAppUserId}")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCartByMyAppUserId(int myAppUserId)
        {
            var cart = await _context.Carts
                .Where(c => c.MyAppUserId == myAppUserId && c.Status)
                .ToListAsync();

            if (cart == null || cart.Count == 0)
            {
                return NotFound("Cart for the user was not found.");
            }

            return Ok(cart);
        }
    }
}