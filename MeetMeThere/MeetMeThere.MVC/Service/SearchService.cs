using System;
using System.Collections.Generic;
using System.Linq;

using MeetMeThere.MVC.Google.Model;
using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Yelp;

using Newtonsoft.Json.Linq;

namespace MeetMeThere.MVC.Service
{
    public class SearchService
    {
        public List<SearchResult> GetSearchResults(double lat, double lng, SearchType searchType)
        {
            var results = new List<SearchResult>();
            var location = new Location() { lat = lat, lng = lng };

            // 3 data from google
            var googleService = new Google.Google();
            var googleData = googleService.SearchPlace(location, searchType);
            results.AddRange(googleData.ToSearchResult().Take(3));


            // 3 data from yelp
            var yelpService = new YelpApiClient();
            var yelpData = yelpService.Search("", location, searchType);
            var businesses = (JArray)yelpData.GetValue("businesses");

            foreach (var business in businesses)
            {
                var name = (string)business["name"];
                var rating = (double)business["rating"];
                var coordinate = business["location"]["coordinate"];
                var latitude = (double)coordinate["latitude"];
                var longitude = (double)coordinate["longitude"];

                results.Add(new SearchResult()
                {
                    Name = name,
                    Rating = rating,
                    Latitude = latitude,
                    Longitude = longitude
                });
            }

            return results;
        }
    }
}