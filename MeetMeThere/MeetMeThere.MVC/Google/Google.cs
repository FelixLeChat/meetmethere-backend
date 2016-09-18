using System;
using System.Net.Http;

using MeetMeThere.MVC.Google.Model;

using Newtonsoft.Json;

namespace MeetMeThere.MVC.Google
{
    public class Google
    {
        private readonly string _apiKey = "AIzaSyCrEql_jYJx3lBaxW6ufSXlh_lq8s4KU54";

        public PlacesApiQueryResponse SearchPlace(Location location, SearchType searchType)
        {
            using (var client = new HttpClient())
            {
                var response = client.GetStringAsync(
                    $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location.lat},{location.lng}&radius=500&type={searchType.Value}&key={this._apiKey}").Result;
                return JsonConvert.DeserializeObject<PlacesApiQueryResponse>(response);
            }
        }
    }
}