using System;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

using MeetMeThere.Api.Helper;

namespace MeetMeThere.Api.Controllers.SecureController
{
    public class SecureAPI : AuthorizeAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            base.OnAuthorization(actionContext);
        }
        
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var token = HttpContext.Current.Request.Headers["Authorization"];

            if (string.IsNullOrWhiteSpace(token))
                return false;

            return JwtHelper.ValidateToken(token);
        }
        
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
        }
    }
}