using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetOrderEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetOrderEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Narudzbe
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrder()
        {
            return await _context.Orders
                .Include(n => n.MyAppUser)
                //.Include(n => n.Supplier)
                .ToListAsync();
        }
    }
}