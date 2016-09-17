using System;
using System.Collections.Generic;

namespace MeetMeThere.Api.Models
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