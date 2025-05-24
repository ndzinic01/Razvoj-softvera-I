using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostWishListEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostWishListEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/ListaZelja
        [HttpPost]
        public async Task<ActionResult<WishList>> PostAddToWishList(WishList wishList)
        {
            if (wishList == null)
            {
                return BadRequest("Invalid wish list data.");
            }

            // Set the current date for the wish list item
            wishList.Date = DateTime.Now; // Automatically set the date to now
            _context.WishLists.Add(wishList);
            await _context.SaveChangesAsync();

            // Return a response indicating success
            return CreatedAtAction(nameof(GetWishListEndpoint), new { myAppUserId = wishList.MyAppUserId }, wishList);
        }
    }
}