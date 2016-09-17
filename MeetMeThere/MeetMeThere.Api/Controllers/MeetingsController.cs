using System;
using System.Web.Http;

using MeetMeThere.Api.Controllers.SecureController;

namespace MeetMeThere.Api.Controllers
{
    [SecureAPI]
    [RoutePrefix("api/meeting")]
    public class MeetingsController : SecureController.SecureController
    {
    }
}
