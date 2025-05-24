﻿using Microsoft.AspNetCore.Mvc;

namespace NewPharmacy.Helper.Api;

//https://github.com/ardalis/ApiEndpoints/blob/main/src/Ardalis.ApiEndpoints/EndpointBase.cs
/// <summary>
/// A base class for an API controller with single action (endpoint).
/// </summary>
[ApiController]
public abstract class MyEndpointBase : ControllerBase
{
}