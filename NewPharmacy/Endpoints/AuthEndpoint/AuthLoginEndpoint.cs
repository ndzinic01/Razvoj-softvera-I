using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Services;
using NewPharmacy.Data.Models;
using NewPharmacy.Data.Models.Auth;
using System.Threading;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints.Auth
{
    [Route("auth")]
    public class AuthLoginEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly MyAuthService _authService;

        public AuthLoginEndpoint(ApplicationDbContext db, MyAuthService authService)
        {
            _db = db;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken = default)
        {
            var loggedInUser = await _db.MyAppUsers
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password, cancellationToken);

            if (loggedInUser == null)
            {
                return Unauthorized(new { Message = "Incorrect username or password" });
            }

            var newAuthToken = await _authService.GenerateAuthToken(loggedInUser, cancellationToken);
            var authInfo = _authService.GetAuthInfo(newAuthToken);

            // ✅ Save user in session or set token
            HttpContext.SetLoggedInUser(loggedInUser);

            return new LoginResponse
            {
                Token = newAuthToken.Value,
                MyAuthInfo = authInfo
            };
        }

        public class LoginRequest
        {
            public required string Username { get; set; }
            public required string Password { get; set; }
        }

        public class LoginResponse
        {
            public required MyAuthInfo? MyAuthInfo { get; set; }
            public string Token { get; internal set; }
        }
    }
}
