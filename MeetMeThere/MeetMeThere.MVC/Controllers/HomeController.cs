using System;
using System.Web.Mvc;

namespace MeetMeThere.MVC.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return this.View("Login");
        }

        public ActionResult Register()
        {
            return this.View("Register");
        }
    }
}