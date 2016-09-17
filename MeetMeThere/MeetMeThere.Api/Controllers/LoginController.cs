using System;
using System.Web.Http;

using MeetMeThere.Api.Models;
using MeetMeThere.Api.Service;

namespace MeetMeThere.Api.Controllers
{
    [RoutePrefix("api/login")]
    public class LoginController : ApiController
    {
        private static ConnexionService _connexionService;
        public LoginController()
        {
            _connexionService = new ConnexionService();
        }

        [HttpPost]
        [Route("")]
        public string Login(LoginMessage login)
        {
            return _connexionService.Login(login);
        }
    }
}
