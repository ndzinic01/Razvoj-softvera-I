using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostOrderEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostOrderEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(OrderCreateDTO dto)
        {
            // 1. Provjera da li korisnik postoji
            var user = await _context.MyAppUsers.FirstOrDefaultAsync(u => u.ID == dto.MyAppUserId);
            if (user == null)
            {
                return BadRequest("Non-existent MyAppUser Id.");
            }

            // 2. Ažuriranje korisničkih podataka
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.PhoneNumber = dto.PhoneNumber;

            // 3. Kreiranje ShippingAddress kao kombinacije više polja
            string fullAddress = $"{dto.Address}, {dto.City}, {dto.PostalCode}, {dto.Country}";

            // 4. Kreiranje nove narudžbe
            var order = new Order
            {
                MyAppUserId = user.ID,
                OrderDate = DateTime.Now,
                Status = "Pending",
                TotalPrice = dto.TotalPrice,
                PaymentMethod = dto.PaymentMethod,
                ShippingAddress = fullAddress,
                IsSupplyOrder = false, // kupac pravi narudžbu, nije supply
                CardNumber = dto.PaymentMethod == "card" ? dto.CardNumber : null,
                ExpiryDate = dto.PaymentMethod == "card" ? dto.ExpiryDate : null,
                CVV = dto.PaymentMethod == "card" ? dto.CVV : null
            };

            // 5. Spasavanje narudžbe
            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // order.Id sada dostupan

            // 6. Dodavanje stavki narudžbe (OrderDetails)
            foreach (var item in dto.Items)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Qty = item.Qty,
                    PricePerUnit = item.PricePerUnit
                };

                _context.OrderDetails.Add(orderDetail);

                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                if (product != null)
                {
                    product.QuantityInStock -= item.Qty;
                    if (product.QuantityInStock < 0)
                    {
                        product.QuantityInStock = 0; // Ne dozvoli negativne zalihe
                    }
                }
            }

            await _context.SaveChangesAsync(); 

            // 7. Dodavanje notifikacija svim farmaceutima
            var pharmacists = await _context.MyAppUsers
                .Where(u => u.IsPharmacist == true)
                .ToListAsync();

            foreach (var pharmacist in pharmacists)
            {
                var notification = new Notification
                {
                    Title = "Nova narudžba",
                    Message = $"Kreirana je nova narudžba ID: {order.Id} od korisnika {user.FirstName} {user.LastName}.",
                    MyAppUserId = pharmacist.ID,
                    OrderId = order.Id,
                    Time = DateTime.UtcNow,
                    Type = "new_order"
                };

                _context.Notifications.Add(notification);
            }

            await _context.SaveChangesAsync(); // Spasi sve notifikacije
            return Ok(order);

        }
    }
}
