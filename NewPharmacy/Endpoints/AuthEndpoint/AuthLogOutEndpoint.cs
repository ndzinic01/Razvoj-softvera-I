using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Helper.Api;
using NewPharmacy.Services;
using System.Threading;
using System.Threading.Tasks;
using static NewPharmacy.Endpoints.AuthEndpoint.AuthLogOutEndpoint;

namespace NewPharmacy.Endpoints.AuthEndpoint;

[Route("auth")]
public class AuthLogOutEndpoint(ApplicationDbContext db, MyAuthService authService) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<LogoutResponse>
{
    [HttpPost("logout")]
    public override async Task<LogoutResponse> HandleAsync(CancellationToken cancellationToken = default)
    {
        // Dohvatanje tokena iz headera
        string? authToken = Request.Headers["my-auth-token"];

        if (string.IsNullOrEmpty(authToken))
        {
            return new LogoutResponse
            {
                IsSuccess = false,
                Message = "Token is missing in the request header."
            };
        }

        // Pokušaj revokacije tokena
        bool isRevoked = await authService.RevokeAuthToken(authToken, cancellationToken);

        return new LogoutResponse
        {
            IsSuccess = isRevoked,
            Message = isRevoked ? "Logout successful." : "Invalid token or already logged out."
        };
    }

    public class LogoutResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}