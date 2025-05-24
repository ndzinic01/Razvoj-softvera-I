using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetWishListEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetWishListEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ListaZelja/KorisnikId/{korisnikId}
        [HttpGet("MyAppUserId/{myAppUserId}")]
        public async Task<ActionResult<IEnumerable<WishList>>> GetWishListByMyAppUserId(int myAppUserId)
        {
            var wishList = await _context.WishLists
                .Where(w => w.MyAppUserId == myAppUserId)
                .OrderBy(w => w.Date)
                .ToListAsync();

            if (wishList == null || !wishList.Any())
            {
                return NotFound($"No wish list found for user with ID {myAppUserId}.");
            }

            return Ok(wishList);
        }
    }
}
