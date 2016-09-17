using System;
using System.Collections.Generic;
using System.Linq;

using MeetMeThere.Api.Models;
using MeetMeThere.Api.Models.Database;

namespace MeetMeThere.Api.Service
{
    public class TeamService : AbstractService
    {
        public TeamService(UserToken userToken): base(userToken)
        {
        }

        public void CreateTeam(TeamModel team)
        {
            using (var db = new meetmethereEntities())
            {
                // create team
                var dbTeam = new Team()
                {
                    Description = team.Description,
                    Name = team.Name
                };
                var newTeam = db.Teams.Add(dbTeam);
                db.SaveChanges();

                // create relation between team and member
                db.Team_User.Add(new Team_User()
                {
                    TeamId = newTeam.Id,
                    UserId = this.UserToken.UserId
                });

                foreach (var user in team.Users)
                {
                    User dbuser = null;

                    // Check for username
                    if (!string.IsNullOrEmpty(user.Username))
                    {
                        dbuser = db.Users.FirstOrDefault(x => x.Username == user.Username);

                        if (dbuser != null)
                        {
                            db.Team_User.Add(new Team_User()
                            {
                                TeamId = newTeam.Id,
                                UserId = dbuser.Id
                            });
                        }
                        
                    }
                    else
                    {
                        // check for email
                        if (!string.IsNullOrEmpty(user.Email))
                            dbuser = db.Users.FirstOrDefault(x => x.Email == user.Email);

                        if (dbuser != null)
                            db.Team_User.Add(new Team_User()
                            {
                                TeamId = newTeam.Id,
                                UserId = this.UserToken.UserId
                            });
                    }

                    db.SaveChanges();
                }
            }
        }

        public List<TeamModel> GetMyTeams()
        {
            using (var db = new meetmethereEntities())
            {
                var user = db.Users.FirstOrDefault(x => x.Id == this.UserToken.UserId);
                if (user == null)
                {
                    return new List<TeamModel>();
                }

                return user.Team_User.Select(x => new TeamModel()
                {
                    Description = x.Team.Description,
                    Name = x.Team.Name,
                    Users = x.Team.Team_User.Select(y => new UserModel()
                    {
                        Email = y.User.Email,
                        Username = y.User.Username
                    }).ToList()
                }).ToList();
            }
        } 
    }
}