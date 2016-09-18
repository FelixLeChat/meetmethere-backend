using System;
using System.Collections.Generic;
using System.Linq;

using MeetMeThere.MVC.Google.Model;
using MeetMeThere.MVC.Models;

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
            var googleData = googleService.SearchPlace(location, searchType).Result;
            results.AddRange(googleData.ToSearchResult().Take(3));


            // 3 data from yelp
            //var yelpService = new Yelp.YelpApiClient();
            //var yelpData = yelpService.Search("", location, searchType);
            //results.AddRange(yelpData);

            return results;
        }
    }
}