using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Web;

using MeetMeThere.MVC.Google.Model;
using MeetMeThere.MVC.Models;

using Newtonsoft.Json.Linq;

using SimpleOAuth;

namespace MeetMeThere.MVC.Yelp
{
    class YelpApiClient
    {
        private const string ConsumerKey = "xUZ157_vJExEd7dlGWdJUA";
        private const string ConsumerSecret = "zwFm1zIC9hkfYDwq69PsOVOR9jY";
        private const string Token = "EC2Ph_VC9m-pXfB6hrHq8D2UX0c6NnpS";
        private const string TokenSecret = "xQss-XJTci_KwYWMluommpjInjE";
        private const string ApiHost = "https://api.yelp.com";
        private const string SearchPath = "/v2/search/";
        private const string BusinessPath = "/v2/business/";
        private const int SearchLimit = 3;

        private JObject PerformRequest(string baseUrl, Dictionary<string, string> queryParams = null)
        {
            var query = HttpUtility.ParseQueryString(String.Empty);

            if (queryParams == null)
            {
                queryParams = new Dictionary<string, string>();
            }

            foreach (var queryParam in queryParams)
            {
                query[queryParam.Key] = queryParam.Value;
            }

            var uriBuilder = new UriBuilder(baseUrl);
            uriBuilder.Query = query.ToString();

            var request = WebRequest.Create(uriBuilder.ToString());
            request.Method = "GET";

            request.SignRequest(
                new Tokens
                {
                    ConsumerKey = ConsumerKey,
                    ConsumerSecret = ConsumerSecret,
                    AccessToken = Token,
                    AccessTokenSecret = TokenSecret
                }
            ).WithEncryption(EncryptionMethod.HMACSHA1).InHeader();

            var response = (HttpWebResponse)request.GetResponse();
            var stream = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            return JObject.Parse(stream.ReadToEnd());
        }

        public JObject Search(string term, Location location, SearchType filter)
        {
            var baseUrl = ApiHost + SearchPath;
            var queryParams = new Dictionary<string, string>()
            {
                { "term", term },
                //{ "location", "montreal" },
                { "ll", location.lat +"," + location.lng },
                { "limit", SearchLimit.ToString() },
                { "sort", "2" },
                { "radius_filter", "500" },
                { "cc", "CA" },
                //{ "category_filter", filter.Value}
            };
            return this.PerformRequest(baseUrl, queryParams);
        }

        public JObject GetBusiness(string businessId)
        {
            var baseUrl = ApiHost + BusinessPath + businessId;
            return this.PerformRequest(baseUrl);
        }
    }
}