using System;

namespace MeetMeThere.MVC.Models
{
    public class CategoryFilter
    {
        private CategoryFilter(string value) {
            this.Value = value; }

        public string Value { get; set; }

        public static CategoryFilter Coffee => new CategoryFilter("coffee");
        public static CategoryFilter Pubs => new CategoryFilter("pubs");

    }
}