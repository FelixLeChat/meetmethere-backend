using System;

namespace MeetMeThere.MVC.Service
{
    public class SearchService
    {
        public string Name { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string Type { get; set; }
        public int Rating { get; set; }
    }
}