using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

using MeetMeThere.MVC.Google.Model;

using Newtonsoft.Json;

namespace MeetMeThere.MVC.Google
{
    public class Google
    {
        private string ApiKey = "AIzaSyAv_U9TbO9WMBlBPx3aWvJJGyhwUFWbGE0";

        public async Task<PlacesApiQueryResponse> SearchPlace(Location location, SearchType searchType)
        {
            using (var client = new HttpClient())
            {
                var response = await client.GetStringAsync(
                    $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location.lat},{location.lng}&radius=500&type={searchType.Value}&key={this.ApiKey}");
                return JsonConvert.DeserializeObject<PlacesApiQueryResponse>(response);
            }
        }
    }
}