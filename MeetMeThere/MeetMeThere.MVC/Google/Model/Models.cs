using System;
using System.Collections.Generic;
using System.Diagnostics;

using MeetMeThere.MVC.Models;

namespace MeetMeThere.MVC.Google.Model
{
    public class Location
    {
        public double lat { get; set; }
        public double lng { get; set; }
    }

    public class Geometry
    {
        public Location location { get; set; }
    }

    public class OpeningHours
    {
        public bool open_now { get; set; }
        public List<object> weekday_text { get; set; }
    }

    public class Photo
    {
        public int height { get; set; }
        public List<string> html_attributions { get; set; }
        public string photo_reference { get; set; }
        public int width { get; set; }
    }

    public class Result
    {
        public Geometry geometry { get; set; }
        public string icon { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public OpeningHours opening_hours { get; set; }
        public List<Photo> photos { get; set; }
        public string place_id { get; set; }
        public double rating { get; set; }
        public string reference { get; set; }
        public string scope { get; set; }
        public List<string> types { get; set; }
        public string vicinity { get; set; }
    }

    public class PlacesApiQueryResponse
    {
        public List<object> html_attributions { get; set; }
        public List<Result> results { get; set; }
        public string status { get; set; }

        public List<SearchResult> ToSearchResult()
        {
            List<SearchResult> searchResults = new List<SearchResult>();

            foreach (var result in this.results)
            {
                searchResults.Add(new SearchResult()
                {
                    Latitude = result.geometry.location.lat,
                    Longitude = result.geometry.location.lng,
                    Name = result.name,
                    Rating = (int)result.rating,
                    Type = result.types
                });
            }
            return searchResults;
        }
    }

    public class SearchType
    {
        private SearchType(string value)
        {
            this.Value = value;
        }

        public string Value { get; set; }

        public static SearchType Bar => new SearchType("bar");
        public static SearchType Park => new SearchType("park");
        public static SearchType Cafe => new SearchType("cafe");
        public static SearchType Library => new SearchType("library");
        public static SearchType University => new SearchType("university");

        public static SearchType GetSearchType(string type)
        {
            type = type.ToLower();

            switch (type)
            {
                case "bar":
                    return Bar;
                case "park":
                    return Park;
                case "library":
                    return Library;
                case "unisersity":
                    return University;
                default:
                    return Cafe;
            }
        }
    }
}