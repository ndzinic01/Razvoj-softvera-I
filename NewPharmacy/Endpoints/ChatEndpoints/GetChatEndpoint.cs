using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
   
    [Route("api/[controller]")]
    [ApiController]
    public class GetChatEndpoint: ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetChatEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Chat/conversation?senderId=1&receiverId=2
        [HttpGet("conversation")]
        public async Task<ActionResult<List<ChatGetDTO>>> GetConversation(int senderId, int receiverId)
        {
            var messages = await _context.Chats
                .Where(c =>
                    (c.SenderId == senderId && c.ReceiverId == receiverId) ||
                    (c.SenderId == receiverId && c.ReceiverId == senderId))
                .OrderBy(c => c.Date)
                .Select(c => new ChatGetDTO
                {
                    Id = c.Id,
                    SenderId = c.SenderId,
                    SenderName = c.Sender.FirstName + " " + c.Sender.LastName,
                    ReceiverId = c.ReceiverId ?? 0,
                    ReceiverName = c.Receiver != null ? c.Receiver.FirstName + " " + c.Receiver.LastName : "",
                    Message = c.Message,
                    Date = c.Date,
                    TypeOfMessage = c.TypeOfMessage,
                    Status = c.Status,
                    IsResponse = c.IsResponse
                })
                .ToListAsync();

            return Ok(messages);
        }
    }
}