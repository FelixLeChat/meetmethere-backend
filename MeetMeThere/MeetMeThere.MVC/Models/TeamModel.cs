﻿using System;
using System.Collections.Generic;

namespace MeetMeThere.MVC.Models
{
    public class TeamModel
    {
        public string Description { get; set; }
        public string Name { get; set; }
        public List<UserModel> Users { get; set; }
        public int Id { get; set; }
    }
}