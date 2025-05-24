using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
using NewPharmacy.Data;
using Microsoft.EntityFrameworkCore;

namespace NewPharmacy.Endpoints.CartEndpoints
{
    public class GetActiveCartEndpoint : Controller
    {
        [ApiController]
        [Route("api/[controller]")]
        public class CartController : ControllerBase
        {
            private readonly ApplicationDbContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public CartController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            [HttpGet("active")]
            public async Task<IActionResult> GetActiveCart()
            {
                // Pribavi ID prijavljenog korisnika
                var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                    return Unauthorized("Korisnik nije prijavljen.");

                // Nađi aktivnu korpu korisnika
                var cart = await _context.Carts
                    .Where(c => c.MyAppUserId == userId && c.Status == true)
                    .OrderByDescending(c => c.Date)
                    .FirstOrDefaultAsync();

                if (cart == null)
                    return Ok(new List<object>()); // Prazna korpa

                // Nađi detalje korpe
                var cartDetails = await _context.CartDetails
                    .Where(cd => cd.CartId == cart.Id)
                    .Include(cd => cd.Product)
                    .Select(cd => new
                    {
                        ProductName = cd.Product.Name,
                        Quantity = cd.Quantity,
                        Price = cd.Price,
                        Total = cd.Price * cd.Quantity
                    })
                    .ToListAsync();

                return Ok(cartDetails);
            }
        }

    }
}
