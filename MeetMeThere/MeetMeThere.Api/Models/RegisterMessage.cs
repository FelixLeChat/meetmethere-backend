﻿using System;

namespace MeetMeThere.Api.Models
{
    public class RegisterMessage
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}