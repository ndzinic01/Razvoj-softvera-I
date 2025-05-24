//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;

//namespace NewPharmacy.Endpoints.AdvertisementEndpoints
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class DeleteAdvertisementEndpoint : ControllerBase
//    {
//    }
//}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;

namespace Pharmacy.Api.Endpoints
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeleteAdvertisementEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeleteAdvertisementEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdvertisement(int id)
        {
            var advertisement = await _context.Advertisements.FirstOrDefaultAsync(x => x.Id == id);
            if (advertisement == null)
            {
                return NotFound("Advertisement not found.");
            }

            try
            {
                _context.Advertisements.Remove(advertisement);
                await _context.SaveChangesAsync();
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

