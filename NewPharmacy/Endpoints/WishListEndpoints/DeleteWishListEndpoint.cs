//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;

//namespace NewPharmacy.Endpoints.WishListEndpoints
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class DeleteWishListEndpoint : ControllerBase
//    {
//    }
//}
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteWishListEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeleteWishListEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // DELETE: api/ListaZelja/{proizvodId}/{korisnikId}
        [HttpDelete("{productId}/{myAppUserId}")]
        public async Task<IActionResult> DeleteFromWishList(int productId, int myAppUserId)
        {
            var wishList = await _context.WishLists
                .Where(w => w.MyAppUserId == myAppUserId && w.Id == productId)
                .FirstOrDefaultAsync();

            if (wishList == null)
            {
                return NotFound($"Wish list item with product ID {productId} not found for user with ID {myAppUserId}.");
            }

            _context.WishLists.Remove(wishList);
            await _context.SaveChangesAsync();

            return NoContent(); // Success response with no content
        }
    }
}