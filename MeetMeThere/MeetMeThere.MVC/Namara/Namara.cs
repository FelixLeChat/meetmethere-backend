using System;
using System.Collections.Generic;
using System.Net.Http;

using MeetMeThere.MVC.Models.Database;

using Newtonsoft.Json;

namespace MeetMeThere.MVC.Namara
{
    public class Namara
    {
        private static string ApiKey { get; set; } = "760f4efd0fdd67d1253a55c45d3668a9ac360fb0a20bb6536e566336dc81a807";

        private static string MontrealOpenUrl { get; set; } = "https://api.namara.io/v0/data_sets/d97e387a-b87d-4beb-b534-66f39eba7494/data/en-3?api_key=";

        public static void ImportData()
        {
            using (var client = new HttpClient())
            {
                var response = client.GetStringAsync(
                    $"{MontrealOpenUrl}{ApiKey}").Result;

                var results = JsonConvert.DeserializeObject<List<MontrealPublicPlace>>(response);

                using (var db = new meetmethereEntities())
                {
                    db.MontrealPublicPlaces.AddRange(results);
                    db.SaveChanges();
                }
            }
        }
    }
}