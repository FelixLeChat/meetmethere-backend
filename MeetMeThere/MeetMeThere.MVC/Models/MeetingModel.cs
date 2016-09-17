using System;

namespace MeetMeThere.MVC.Models
{
    public class MeetingModel
    {
        public DateTime StartDateTime { get; set; }
        public bool NeedWifi { get; set; }
        public bool NeedElectricity { get; set; }
        public string Name { get; set; }
        public int TeamId { get; set; }
    }
}