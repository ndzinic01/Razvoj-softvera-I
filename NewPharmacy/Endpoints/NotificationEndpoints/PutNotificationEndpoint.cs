using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;

namespace NewPharmacy.Endpoints.NotificationEndpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PutNotificationEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PutNotificationEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkNotificationAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
                return NotFound();

            notification.Read = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
