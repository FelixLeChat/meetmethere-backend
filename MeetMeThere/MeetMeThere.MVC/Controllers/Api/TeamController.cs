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

        [Route("{id}")]
        [HttpGet]
        public TeamModel GetTeamModel(int id)
        {
            return this._teamService.GetTeamModel(id);
        }

        [Route("create")]
        [HttpPost]
        public void CreateTeam(TeamModel team)
        {
            this._teamService.CreateTeam(team);
        }
    }
}
