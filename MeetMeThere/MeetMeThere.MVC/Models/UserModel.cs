using System;

namespace MeetMeThere.MVC.Models
{
    public class UserModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Title { get; set; }
        public string Image { get; set; } // path au complet vers une image
    }
}