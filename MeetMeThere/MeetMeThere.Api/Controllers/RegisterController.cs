using System.Web.Http;

using MeetMeThere.Api.Models;
using MeetMeThere.Api.Service;

namespace MeetMeThere.Api.Controllers
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
        [Route("register")]
        public string Register(RegisterMessage register)
        {
            return _connexionService.Register(register);
        }
    }
}
