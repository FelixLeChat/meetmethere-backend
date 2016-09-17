using System;
using System.Collections.Generic;
using System.Web.Http;

using MeetMeThere.MVC.Controllers.SecureController;
using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Service;

namespace MeetMeThere.MVC.Controllers.Api
{
    [SecureAPI]
    [RoutePrefix("api/meeting")]
    public class MeetingController : SecureController.SecureController
    {
        private readonly MeetingService _meetingService;
        public MeetingController()
        {
            this._meetingService = new MeetingService(this.UserToken);
        }

        [Route("")]
        [HttpGet]
        public List<MeetingModel> GetMyMeetings()
        {
            return this._meetingService.GetMyMeetings();
        }

    }
}
