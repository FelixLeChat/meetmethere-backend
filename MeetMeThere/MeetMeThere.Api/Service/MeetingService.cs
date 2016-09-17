using System;
using System.Collections.Generic;
using System.Linq;

using MeetMeThere.Api.Models;
using MeetMeThere.Api.Models.Database;

namespace MeetMeThere.Api.Service
{
    public class MeetingService : AbstractService
    {
        public MeetingService(UserToken userToken): base(userToken)
        {
        }

        public void CreateMeeting(MeetingModel meeting)
        {
            using (var db = new meetmethereEntities())
            {
                // create Meeting
                var dbMeeting = new Meeting()
                {
                    NeedElectricity = meeting.NeedElectricity,
                    NeedWifi = meeting.NeedWifi,
                    StartDateTime = meeting.StartDateTime,
                    Name = meeting.Name
                };
                db.Meetings.Add(dbMeeting);
                db.SaveChanges();

                // create relation between meeting and teams
                db.Team_Meeting.Add(new Team_Meeting()
                {
                    TeamId = meeting.TeamId,
                    MeetingId = dbMeeting.Id
                });
            }
        }

        public List<TeamModel> GetMyMeetings()
        {
            using (var db = new meetmethereEntities())
            {
                var teamService = new TeamService(this.UserToken);
                var myTeams = teamService.GetMyTeams();

                //return db.Team_Meeting.Where(x => myTeams.Select(x => x.Id).Contains(x.TeamId))
            }

            return null;
        }
    }
}