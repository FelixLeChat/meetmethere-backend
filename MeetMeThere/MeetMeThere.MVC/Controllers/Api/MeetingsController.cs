using System;
using System.Collections.Generic;
using System.Web.Http;

using MeetMeThere.MVC.Controllers.SecureController;
using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Service;

namespace MeetMeThere.MVC.Controllers.Api
{
    [SecureAPI]
    [RoutePrefix("api/team")]
    public class MeetingController : SecureController.SecureController
    {
        private readonly MeetingService _teamService;
        public MeetingController()
        {
            this._teamService = new MeetingService(this.UserToken);
        }

        [Route("")]
        [HttpGet]
        public List<MeetingModel> GetMyMeetings()
        {
            return null; //this._teamService.GetMyTeams();
        }

    }
}
