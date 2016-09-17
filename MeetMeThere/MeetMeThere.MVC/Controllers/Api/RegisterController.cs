using System;
using System.Web.Http;

using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Service;

namespace MeetMeThere.MVC.Controllers.Api
{
    [RoutePrefix("api/register")]
    public class RegisterController : ApiController
    {
        private static ConnexionService _connexionService;
        public RegisterController()
        {
            _connexionService = new ConnexionService();
        }

        [HttpPost]
        [Route("")]
        public string Register(RegisterMessage register)
        {
            return _connexionService.Register(register);
        }
    }
}
