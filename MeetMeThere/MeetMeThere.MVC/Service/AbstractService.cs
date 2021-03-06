﻿using System;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;

using MeetMeThere.MVC.Helper;
using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Models.Database;

namespace MeetMeThere.MVC.Service
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
            catch (DbEntityValidationException dbEx)
            {
                var message = dbEx.EntityValidationErrors.Aggregate("", (current1, validationErrors) => validationErrors.ValidationErrors.Aggregate(current1, (current, validationError) => current + $"{validationErrors.Entry.Entity.ToString()}:{validationError.ErrorMessage}"));
                throw HttpResponseExceptionHelper.Create(message, HttpStatusCode.BadRequest);
            }
        }
    }
}