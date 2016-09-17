using System;
using System.Net;
using System.Web;
using System.Web.Http;

using MeetMeThere.Api.Helper;
using MeetMeThere.Api.Models;

namespace MeetMeThere.Api.Controllers.SecureController
{
    public class SecureController : ApiController
    {
        protected UserToken UserToken { get; set; }
        protected SecureController()
        {
            this.UserToken = GetUserToken();
        }

        public static UserToken GetUserToken()
        {
            try
            {
                var token = HttpContext.Current.Request.Headers["Authorization"];

                if (string.IsNullOrWhiteSpace(token))
                    throw HttpResponseExceptionHelper.Create("NULL or empty token - Secure controller", HttpStatusCode.Forbidden);

                return JwtHelper.DecodeToken(token);
            }
            catch (Exception)
            {
                throw HttpResponseExceptionHelper.Create("Invalid token - Secure controller", HttpStatusCode.Forbidden);
            }
        }
    }
}