﻿using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models.Auth;
using NewPharmacy.Helper;

namespace NewPharmacy.Services
{
    public class MyAuthService
    {
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        // Constructor with dependency injection
        public MyAuthService(ApplicationDbContext applicationDbContext, IHttpContextAccessor httpContextAccessor)
        {
            _applicationDbContext = applicationDbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        // Generisanje novog tokena za korisnika
        public async Task<MyAuthenticationToken> GenerateAuthToken(MyAppUser user, CancellationToken cancellationToken = default)
        {
            string randomToken = MyTokenGenerator.Generate(10);

            var authToken = new MyAuthenticationToken
            {
                IpAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
                Value = randomToken,
                MyAppUser = user,
                RecordedAt = DateTime.Now
            };

            _applicationDbContext.MyAuthenticationTokens.Add(authToken);
            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return authToken;
        }

        // Uklanjanje tokena iz baze podataka
        public async Task<bool> RevokeAuthToken(string tokenValue, CancellationToken cancellationToken = default)
        {
            var authToken = await _applicationDbContext.MyAuthenticationTokens
                .FirstOrDefaultAsync(t => t.Value == tokenValue, cancellationToken);

            if (authToken == null)
                return false;

            _applicationDbContext.MyAuthenticationTokens.Remove(authToken);
            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return true;
        }

        // Dohvatanje informacija o autentifikaciji korisnika
        public MyAuthInfo GetAuthInfo()
        {
            string? authToken = _httpContextAccessor.HttpContext?.Request.Headers["my-auth-token"];
            if (string.IsNullOrEmpty(authToken))
            {
                return GetAuthInfo(null);
            }

            var myAuthToken = _applicationDbContext.MyAuthenticationTokens
                .Include(x => x.MyAppUser)
                .SingleOrDefault(x => x.Value == authToken);

            return GetAuthInfo(myAuthToken);
        }
        public int? GetLoggedInUserId()
        {
            string? authToken = _httpContextAccessor.HttpContext?.Request.Headers["my-auth-token"];
            if (string.IsNullOrEmpty(authToken)) return null;

            var myAuthToken = _applicationDbContext.MyAuthenticationTokens
                .Include(x => x.MyAppUser)
                .FirstOrDefault(x => x.Value == authToken);

            return myAuthToken?.MyAppUserId;
        }

        public MyAuthInfo GetAuthInfo(MyAuthenticationToken? myAuthToken)
        {
            if (myAuthToken == null)
            {
                return new MyAuthInfo
                {
                    IsAdmin = false,
                    IsPharmacist = false,
                    IsCustomer = false,
                    IsLoggedIn = false,
                };
            }

            return new MyAuthInfo
            {
                UserId = myAuthToken.MyAppUserId,
                Username = myAuthToken.MyAppUser!.Username,
                FirstName = myAuthToken.MyAppUser.FirstName,
                LastName = myAuthToken.MyAppUser.LastName,
                IsAdmin = myAuthToken.MyAppUser.IsAdmin,
                IsPharmacist = myAuthToken.MyAppUser.IsPharmacist,
                IsCustomer = myAuthToken.MyAppUser.IsCustomer,
                IsLoggedIn = true
            };
        }
    }

    // DTO to hold authentication information
    public class MyAuthInfo
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsPharmacist { get; set; }
        public bool IsCustomer { get; set; }
        public bool IsLoggedIn { get; set; }
    }
}
