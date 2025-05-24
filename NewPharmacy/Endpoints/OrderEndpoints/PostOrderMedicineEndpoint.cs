//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using NewPharmacy.Data.Models;
//using NewPharmacy.Data;

//namespace NewPharmacy.Endpoints.OrderEndpoints
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class OrderMedicineEndpoint : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;

//        public OrderMedicineEndpoint(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        [HttpPost]
//        public async Task<IActionResult> OrderMedicine([FromBody] OrderMedicineDTO request)
//        {
//            var medicine = await _context.Products.FindAsync(request.MedicineId);
//            if (medicine == null)
//            {
//                return NotFound(new { message = "Lijek nije pronađen." });
//            }

//            var quantityToOrder = 50;

//            var order = new Order
//            {
//                OrderDate = DateTime.UtcNow,
//                MyAppUserId = request.UserId,
//                Status = "Pending",
//                IsSupplyOrder = true // <-- OVO DODANO
//            };
//            _context.Orders.Add(order);
//            await _context.SaveChangesAsync();

//            var orderDetail = new OrderDetail
//            {
//                OrderId = order.Id,
//                ProductId = medicine.Id,
//                Qty = quantityToOrder,
//                PricePerUnit = medicine.Price
//            };
//            _context.OrderDetails.Add(orderDetail);

//            var notification = new Notification
//            {
//                MyAppUserId = request.UserId,
//                Title = "Nova narudžba zaliha",
//                Message = $"Uspješno ste naručili lijek: {medicine.Name}",
//                Time = DateTime.UtcNow,
//                Read = false
//            };
//            _context.Notifications.Add(notification);

//            await _context.SaveChangesAsync();

//            return Ok(new { message = "Narudžba za lijek uspješno kreirana." });
//        }
//    }

//    public class OrderMedicineDTO
//    {
//        public int MedicineId { get; set; }
//        public int UserId { get; set; }
//    }
//}


using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data.Models;
using NewPharmacy.Data;

namespace NewPharmacy.Endpoints.OrderEndpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderMedicineEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderMedicineEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> OrderMedicint([FromBody] OrderMedicineDTO request)
        {
            var medicine = await _context.Products.FindAsync(request.MedicineId);
            if (medicine == null)
            {
                return NotFound(new { message = "Lijek nije pronađen." });
            }

            if (request.Quantity <= 0)
            {
                return BadRequest(new { message = "Količina mora biti veća od 0." });
            }

            var order = new Order
            {
                OrderDate = DateTime.UtcNow,
                MyAppUserId = request.UserId,
                Status = "Pending",
                IsSupplyOrder = true,
                PaymentMethod = "Internal Transfer",
                ShippingAddress = "Apoteka Sarajevo",
                TotalPrice = request.Quantity * (decimal)medicine.Price
            };


            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var orderDetail = new OrderDetail
            {
                OrderId = order.Id,
                ProductId = medicine.Id,
                Qty = request.Quantity,
                PricePerUnit = medicine.Price
            };
            _context.OrderDetails.Add(orderDetail);

            var notification = new Notification
            {
                MyAppUserId = request.UserId,
                Title = "Nova narudžba zaliha",
                Message = $"Uspješno ste naručili lijek: {medicine.Name} ({request.Quantity} komada)",
                Time = DateTime.UtcNow,
                Read = false
            };
            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Narudžba za lijek uspješno kreirana." });
        }
    }

    public class OrderMedicineDTO
    {
        public int MedicineId { get; set; }
        public int UserId { get; set; }
        public int Quantity { get; set; } // <-- DODANO
    }
}

