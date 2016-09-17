using System;
using System.Web.Http;

using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Service;

namespace MeetMeThere.MVC.Controllers.Api
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
