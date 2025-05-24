using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;

namespace NewPharmacy.Endpoints.NotificationEndpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteNotificationEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public DeleteNotificationEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
                return NotFound();

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
