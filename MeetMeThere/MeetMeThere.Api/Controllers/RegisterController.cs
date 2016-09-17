using System.Web.Http;
using System.Web.Http.Cors;

using MeetMeThere.Api.Models;
using MeetMeThere.Api.Service;

namespace MeetMeThere.Api.Controllers
{
    [RoutePrefix("api/register")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
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
