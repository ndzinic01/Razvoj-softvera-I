using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints.OrderEndpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpdateOrderStatusEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UpdateOrderStatusEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPut("{orderId}")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusRequestDTO request)
        {
            var order = await _context.Orders.FindAsync(orderId);

            if (order == null)
                return NotFound("Narudžba nije pronađena.");

            if (order.Status == "Delivered")
                return BadRequest("Narudžba je već isporučena. Status se više ne može mijenjati.");

            // 1. Promijeni status narudžbe
            order.Status = request.NewStatus;

            // 2. Dodaj novu notifikaciju
            var notification = new Notification
            {
                Title = "Status narudžbe promijenjen",
                Message = $"Status vaše narudžbe #{order.Id} je sada '{request.NewStatus}'.",
                MyAppUserId = order.MyAppUserId
            };
            _context.Notifications.Add(notification);

            // 3. Ako je status 'Delivered', ažuriraj zalihe
            if ((request.NewStatus == "Delivered") ||
            (request.NewStatus == "Approved" && order.IsSupplyOrder))
            {
                var orderDetails = await _context.OrderDetails
                    .Where(od => od.OrderId == orderId)
                    .ToListAsync();

                foreach (var detail in orderDetails)
                {
                    var product = await _context.Products.FindAsync(detail.ProductId);
                    if (product != null)
                    {
                        product.QuantityInStock += detail.Qty;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok("Status narudžbe ažuriran i obavijest poslana.");
        }
    }
}

