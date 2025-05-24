using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace Pharmacy.Api.Endpoints
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostAdvertisementEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostAdvertisementEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAdvertisement([FromBody] Advertisement advertisement)
        {
            if (advertisement == null)
            {
                return BadRequest("Advertisement data is required.");
            }

            if (string.IsNullOrEmpty(advertisement.Title) || string.IsNullOrEmpty(advertisement.imageURL))
            {
                return BadRequest("Title and ImageURL are required.");
            }

            try
            {
                await _context.Advertisements.AddAsync(advertisement);
                await _context.SaveChangesAsync();

                return Created("api/GetAdvertisement", advertisement);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

