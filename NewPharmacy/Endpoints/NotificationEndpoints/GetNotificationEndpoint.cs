using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data.Models;
using NewPharmacy.Data;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace NewPharmacy.Endpoints.NotificationEndpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetNotificationEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetNotificationEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        //[HttpGet("{userId}")]
        //public async Task<ActionResult<List<FullNotificationDTO>>> GetNotifications(int userId)
        //{
        //    var notifs = await _context.Notifications
        //        .Where(n => n.MyAppUserId == userId)
        //        .OrderByDescending(n => n.Time)
        //        .Select(n => new FullNotificationDTO
        //        {
        //            Id = n.Id,
        //            Title = n.Title,
        //            Message = n.Message,
        //            Time = n.Time,
        //            Read = n.Read,
        //            Type = n.Type,
        //            MyAppUserId = n.MyAppUserId,
        //            // Provjera nullable OrderId prije cast-a
        //            OrderId = n.OrderId.HasValue ? n.OrderId.Value : 0,
        //            // Ako postoji OrderId, uzmi order, inače null
        //            Order = n.OrderId.HasValue
        //                ? _context.Orders.FirstOrDefault(o => o.Id == n.OrderId.Value)
        //                : null,
        //            // Ako postoji OrderId, uzmi OrderDetails, inače prazna lista
        //            OrderDetails = n.OrderId.HasValue
        //                ? _context.OrderDetails
        //                    .Where(od => od.OrderId == n.OrderId.Value)
        //                    .Include(od => od.Product)
        //                    .ToList()
        //                : new List<OrderDetail>()
        //        })
        //        .ToListAsync();


        //    return Ok(notifs);
        //}
        [HttpGet("{userId}")]
        public async Task<ActionResult<List<FullNotificationDTO>>> GetNotifications(int userId)
        {
            var notifs = await _context.Notifications
                .Where(n => n.MyAppUserId == userId)
                .OrderByDescending(n => n.Time)
                .Select(n => new FullNotificationDTO
                {
                    Id = n.Id,
                    Title = n.Title,
                    Message = n.Message,
                    Time = n.Time,
                    Read = n.Read,
                    Type = n.Type,
                    MyAppUserId = n.MyAppUserId,
                    SenderId = n.SenderId, // 👈 Dodano ovo!
                    OrderId = n.OrderId ?? 0,
                    Order = n.OrderId.HasValue
                        ? _context.Orders.FirstOrDefault(o => o.Id == n.OrderId.Value)
                        : null,
                    OrderDetails = n.OrderId.HasValue
                        ? _context.OrderDetails
                            .Where(od => od.OrderId == n.OrderId.Value)
                            .Include(od => od.Product)
                            .ToList()
                        : new List<OrderDetail>()
                })
                .ToListAsync();

            return Ok(notifs);
        }
    }
}
