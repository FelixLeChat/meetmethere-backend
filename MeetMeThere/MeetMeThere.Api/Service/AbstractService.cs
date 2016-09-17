using System;
using System.Linq;
using System.Net;

using MeetMeThere.Api.Helper;
using MeetMeThere.Api.Models;
using MeetMeThere.Api.Models.Database;

namespace MeetMeThere.Api.Service
{
    public class AbstractService
    {
        protected UserToken UserToken { get; set; }
        protected AbstractService(UserToken userToken)
        {
            this.UserToken = userToken;
        }

        protected void TrySaveDb(meetmethereEntities db)
        {
            try
            {
                db.SaveChanges();
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
            {
                var message = dbEx.EntityValidationErrors.Aggregate("", (current1, validationErrors) => validationErrors.ValidationErrors.Aggregate(current1, (current, validationError) => current + $"{validationErrors.Entry.Entity.ToString()}:{validationError.ErrorMessage}"));
                throw HttpResponseExceptionHelper.Create(message, HttpStatusCode.BadRequest);
            }
        }
    }
}