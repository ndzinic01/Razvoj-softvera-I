using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    //[Route("api/[controller]")]
    //[ApiController]
    //public class PostChatEndpoint : ControllerBase
    //{
    //    private readonly ApplicationDbContext _context;

    //    public PostChatEndpoint(ApplicationDbContext context)
    //    {
    //        _context = context;
    //    }

    /*[HttpPost]
    public async Task<ActionResult<Chat>> PostMessage(Chat message)
    {
        if (message == null || string.IsNullOrWhiteSpace(message.Message))
            return BadRequest("Message content is required.");

        message.Date = DateTime.Now;
        message.TypeOfMessage ??= "question";
        message.Status ??= "sent";

        _context.Chats.Add(message);


        var notification = new Notification
        {
            Title = "Nova korisnička poruka",
            Message = message.Message,
            Time = DateTime.Now,
            Read = false,
            MyAppUserId = message.MyAppUserId, // pošiljalac
            OrderId = null,
            Type = "user_message"
        };

        _context.Notifications.Add(notification);


        await _context.SaveChangesAsync();*/
    /*[HttpPost]
    public async Task<ActionResult<Chat>> PostMessage(Chat message)
    {
        if (message == null || string.IsNullOrWhiteSpace(message.Message))
            return BadRequest("Message content is required.");

        message.Date = DateTime.Now;
        message.TypeOfMessage ??= "question";
        message.Status ??= "sent";
        message.ReceiverId = message.ReceiverId;

        _context.Chats.Add(message);

        // Nađi sve farmaceute osim onog sa ID = 1
        var pharmacists = _context.MyAppUsers
            .Where(u => u.IsPharmacist==true)
            .ToList();

        foreach (var pharmacist in pharmacists)
        {
            var notification = new Notification
            {
                Title = "Nova korisnička poruka",
                Message = message.Message,
                Time = DateTime.Now,
                Read = false,
                MyAppUserId = pharmacist.ID, // šalje notifikaciju farmaceutu
                OrderId = null,
                Type = "user_message"
            };

            _context.Notifications.Add(notification);
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(PostMessage), new { id = message.Id }, message);
    }*/
    //[HttpPost]
    //public async Task<ActionResult> PostMessage(Chat message)
    //{
    //    if (message == null || string.IsNullOrWhiteSpace(message.Message))
    //        return BadRequest("Sadržaj poruke je obavezan.");

    //    // Postavi dodatne atribute
    //    message.Date = DateTime.Now;
    //    message.TypeOfMessage ??= "question";
    //    message.Status ??= "sent";

    //    // Pošto poruka ide svim farmaceutima, ReceiverId ostaje null
    //    message.ReceiverId = null;

    //    // Sačuvaj poruku samo jednom
    //    _context.Chats.Add(message);
    //    await _context.SaveChangesAsync(); // da bi dobio ID poruke ako treba

    //    // Nađi sve farmaceute
    //    var pharmacists = await _context.MyAppUsers
    //        .Where(u => u.IsPharmacist)
    //        .ToListAsync();

    //    // Kreiraj notifikaciju za svakog farmaceuta
    //    foreach (var pharmacist in pharmacists)
    //    {
    //        var notification = new Notification
    //        {
    //            Title = "Nova korisnička poruka",
    //            Message = message.Message,
    //            Time = DateTime.Now,
    //            Read = false,
    //            MyAppUserId = pharmacist.ID,
    //            OrderId = null,
    //            Type = "user_message"
    //        };

    //        _context.Notifications.Add(notification);
    //    }

    //    await _context.SaveChangesAsync();

    //    return Ok(new { message = "Poruka je uspješno poslana svim farmaceutima." });
    //}



    //}

    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ChatCreateDTO dto)
        {
            var chat = new Chat
            {
                SenderId = dto.SenderId,
                ReceiverId = dto.ReceiverId,
                Message = dto.Message,
                Date = DateTime.Now,
                TypeOfMessage = dto.TypeOfMessage,
                Status = dto.Status,
                IsResponse = dto.IsResponse
            };

            _context.Chats.Add(chat);

            // Dohvati korisnika koji šalje poruku (sender)
            var sender = await _context.MyAppUsers.FindAsync(dto.SenderId);
            if (sender == null)
            {
                return NotFound("Sender korisnik nije pronađen.");
            }

            // **Ne kreiraj notifikaciju ako je poruka odgovor farmaceuta**
            if (!(dto.IsResponse && sender.IsPharmacist))
            {
                // Dohvati sve farmaceute
                var pharmacists = await _context.MyAppUsers
                    .Where(u => u.IsPharmacist)
                    .ToListAsync();

                foreach (var pharmacist in pharmacists)
                {
                    var notification = new Notification
                    {
                        Title = "Nova poruka od korisnika",
                        Message = $"Nova poruka od korisnika {sender.FirstName} {sender.LastName}: \"{dto.Message}\"",
                        MyAppUserId = pharmacist.ID,
                        Time = DateTime.UtcNow,
                        Type = "new_message",
                        SenderId = dto.SenderId
                    };

                    _context.Notifications.Add(notification);
                }
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}