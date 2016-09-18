using System;

namespace MeetMeThere.MVC.Models
{
    public class MeetingModel
    {
        public DateTime StartDateTime { get; set; }
        public bool NeedWifi { get; set; }
        public bool NeedElectricity { get; set; }
        public string Name { get; set; }
        public string TeamName { get; set; }
        public string LocationName { get; set; }
        public string Address { get; set; }
        public int TeamId { get; set; }
    }
}