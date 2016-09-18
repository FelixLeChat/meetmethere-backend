using System;
using System.Collections.Generic;
using System.Linq;

using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Models.Database;

namespace MeetMeThere.MVC.Service
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

        public List<MeetingModel> GetMyMeetings()
        {
            using (var db = new meetmethereEntities())
            {
                var result = new List<MeetingModel>();
                var teamService = new TeamService(this.UserToken);
                var myTeams = teamService.GetMyTeams();

                //return db.Team_Meeting
                var meetings = db.Team_Meeting.Where(x => myTeams.Select(y => y.Id).ToList().Contains(x.TeamId ?? 0)).Select(x => x.Meeting);

                foreach (var meeting in meetings)
                {
                    result.Add(new MeetingModel()
                    {
                        LocationName = meeting.LocationName,
                        Name = meeting.Name,
                        StartDateTime = meeting.StartDateTime ?? new DateTime(),
                        Address = meeting.Address
                    });
                }
                return result;
            }
        }
    }
}