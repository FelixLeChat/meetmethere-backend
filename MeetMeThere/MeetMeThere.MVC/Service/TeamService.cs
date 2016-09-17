using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

using MeetMeThere.MVC.Helper;
using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Models.Database;

namespace MeetMeThere.MVC.Service
{
    public class TeamService : AbstractService
    {
        public TeamService(UserToken userToken): base(userToken)
        {
        }

        public void CreateTeam(TeamModel team)
        {
            if (team == null || string.IsNullOrEmpty(team.Description) || string.IsNullOrEmpty(team.Name))
                throw HttpResponseExceptionHelper.Create("Empty team creation", HttpStatusCode.BadRequest);

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
                            db.SaveChanges();

                            db.User_Team_Title.Add(new User_Team_Title() { TeamId = newTeam.Id, UserId = dbuser.Id, Title = user.Title });
                        }
                        
                    }
                    else
                    {
                        // check for email
                        if (!string.IsNullOrEmpty(user.Email))
                            dbuser = db.Users.FirstOrDefault(x => x.Email == user.Email);

                        if (dbuser != null)
                        {
                            db.Team_User.Add(new Team_User()
                            {
                                TeamId = newTeam.Id,
                                UserId = this.UserToken.UserId
                            });

                            db.SaveChanges();
                            db.User_Team_Title.Add(new User_Team_Title() { TeamId = newTeam.Id, UserId = dbuser.Id, Title = user.Title });
                        }
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
                    Id = x.TeamId ?? 0,
                    Users = x.Team.Team_User.Select(y => new UserModel()
                    {
                        Email = y.User.Email,
                        Username = y.User.Username,
                        Title = db.User_Team_Title.Where(z => z.TeamId == x.TeamId && z.UserId == x.UserId).Select(z => z.Title).FirstOrDefault(),
                        Image = ImageProvider.GetRandomImgPath()
                    }).ToList()
                }).ToList();
            }
        } 
    }
}