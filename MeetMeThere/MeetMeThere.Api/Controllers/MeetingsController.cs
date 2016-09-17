using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using MeetMeThere.Api.Models.Database;

namespace MeetMeThere.Api.Controllers
{
    public class MeetingsController : ODataController
    {
        private meetmethereEntities db = new meetmethereEntities();

        // GET: odata/Meetings
        [EnableQuery]
        public IQueryable<Meeting> GetMeetings()
        {
            return db.Meetings;
        }

        // GET: odata/Meetings(5)
        [EnableQuery]
        public SingleResult<Meeting> GetMeeting([FromODataUri] int key)
        {
            return SingleResult.Create(db.Meetings.Where(meeting => meeting.Id == key));
        }

        // PUT: odata/Meetings(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Meeting> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Meeting meeting = db.Meetings.Find(key);
            if (meeting == null)
            {
                return NotFound();
            }

            patch.Put(meeting);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeetingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(meeting);
        }

        // POST: odata/Meetings
        public IHttpActionResult Post(Meeting meeting)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Meetings.Add(meeting);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (MeetingExists(meeting.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(meeting);
        }

        // PATCH: odata/Meetings(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Meeting> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Meeting meeting = db.Meetings.Find(key);
            if (meeting == null)
            {
                return NotFound();
            }

            patch.Patch(meeting);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeetingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(meeting);
        }

        // DELETE: odata/Meetings(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Meeting meeting = db.Meetings.Find(key);
            if (meeting == null)
            {
                return NotFound();
            }

            db.Meetings.Remove(meeting);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Meetings(5)/Team_Meeting
        [EnableQuery]
        public IQueryable<Team_Meeting> GetTeam_Meeting([FromODataUri] int key)
        {
            return db.Meetings.Where(m => m.Id == key).SelectMany(m => m.Team_Meeting);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MeetingExists(int key)
        {
            return db.Meetings.Count(e => e.Id == key) > 0;
        }
    }
}
