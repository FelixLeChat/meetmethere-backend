using System;
using System.Linq;
using System.Net;

using MeetMeThere.Api.Helper;
using MeetMeThere.Api.Models;
using MeetMeThere.Api.Models.Database;

namespace MeetMeThere.Api.Service
{
    public class ConnexionService
    {
        public string Register(RegisterMessage register)
        {
            // User
            User newUser;

            //Check if credentials are OK
            if (string.IsNullOrWhiteSpace(register.Username))
                throw HttpResponseExceptionHelper.Create("", HttpStatusCode.BadRequest);

            if (!register.Username.All(char.IsLetterOrDigit))
                throw HttpResponseExceptionHelper.Create("", HttpStatusCode.BadRequest);

            using (var db = new meetmethereEntities())
            {
                User user = null;

                // Check username
                if (!string.IsNullOrWhiteSpace(register.Username))
                    user = db.Users.FirstOrDefault(x => x.Username == register.Username);
                // User already exist
                if (user != null)
                    throw HttpResponseExceptionHelper.Create("User Exist",
                        HttpStatusCode.BadRequest);

                // Check email
                if (!string.IsNullOrWhiteSpace(register.Email))
                    user = db.Users.FirstOrDefault(x => x.Email == register.Email);
                // User already exist
                if (user != null)
                    throw HttpResponseExceptionHelper.Create("User Exist",
                        HttpStatusCode.BadRequest);

                // create new user
                newUser = new User()
                {
                    Username = register.Username,
                    HashPassword = PasswordHash.CreateHash(register.Password),
                    Email = register.Email
                };

                // Add user
                newUser = this.CreateUser(newUser);
                db.SaveChanges();
            }

            return this.GetToken(newUser);
        }

        public string Login(LoginMessage message)
        {
            using (var db = new meetmethereEntities())
            {
                var user = db.Users.FirstOrDefault(x => x.Username == message.Username);

                if (user == null)
                    throw HttpResponseExceptionHelper.Create("Invalid", HttpStatusCode.BadRequest);

                if (!PasswordHash.ValidatePassword(message.Password, user.HashPassword))
                    throw HttpResponseExceptionHelper.Create("Invalid", HttpStatusCode.Forbidden);

                return this.GetToken(user);
            }
        }

        #region Private
        private User CreateUser(User user)
        {
            using (var db = new meetmethereEntities())
            {
                // save database
                var newUser = db.Users.Add(user);
                db.SaveChanges();
                return newUser;
            }
        }

        private string GetToken(User user)
        {
            // Generate token
            var token = new UserToken()
            {
                Username = user.Username
            };
            return JwtHelper.EncodeToken(token);
        }
        #endregion
    }
}