using System;
using System.Web.Mvc;

namespace MeetMeThere.MVC.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Dashboard
        public ActionResult Teams()
        {
            return View();
        }
    }
}