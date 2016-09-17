using System;

namespace MeetMeThere.Api.Models
{
    public class UserToken
    {
        public string Token { get; set; } = "";
        public string Username { get; set; } = "";
        public int UserId { get; set; }
        public DateTime ExpirationDate { get; set; } = new DateTime();
    }
}