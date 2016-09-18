using System;
using System.Collections.Generic;

namespace MeetMeThere.MVC.Models
{
    public class SearchResult
    {
        public string Name { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public List<string> Type { get; set; }
        public double Rating { get; set; }
    }
}