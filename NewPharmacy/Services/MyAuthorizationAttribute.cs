namespace NewPharmacy.Services;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
public class MyAuthorizationAttribute(bool isAdmin, bool isPharmacist, bool isCustomer) : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Dobavi MyAuthService iz servisa
        var authService = context.HttpContext.RequestServices.GetService<MyAuthService>();
        if (authService == null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        // Pozovi GetAuthInfo za dobijanje korisničkih informacija na osnovu tokena
        var authInfo = authService.GetAuthInfo();
        if (authInfo == null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        // Provjeri role korisnika
        if (isAdmin && !authInfo.IsAdmin)
        {
            context.Result = new ForbidResult();
            return;
        }

        if (isPharmacist && !authInfo.IsPharmacist)
        {
            context.Result = new ForbidResult();
            return;
        }
        if (isCustomer && !authInfo.IsCustomer)
        {
            context.Result = new ForbidResult();
            return;
        }
    }
}
