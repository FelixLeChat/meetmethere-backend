using System;
using System.Collections.Generic;
using System.Web.Http;

using MeetMeThere.Api.Controllers.SecureController;
using MeetMeThere.Api.Models;
using MeetMeThere.Api.Service;

namespace MeetMeThere.Api.Controllers
{
    [SecureAPI]
    [RoutePrefix("api/team")]
    public class TeamController : SecureController.SecureController
    {
        private readonly TeamService _teamService;
        public TeamController()
        {
            this._teamService = new TeamService(this.UserToken);
        }

        [Route("")]
        [HttpGet]
        public List<TeamModel> GetMyTeams()
        {
            return this._teamService.GetMyTeams();
        }

        [Route("create")]
        [HttpPost]
        public void CreateTeam(TeamModel team)
        {
            this._teamService.CreateTeam(team);
        }
    }
}
