using System;
using System.Collections.Generic;
using System.Web.Http;

using MeetMeThere.MVC.Google.Model;
using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Service;

namespace MeetMeThere.MVC.Controllers
{
    [RoutePrefix("api/search")]
    public class SearchController : ApiController
    {
        private readonly SearchService _searchService;

        public SearchController()
        {
            this._searchService = new SearchService();
        }

        [Route("")]
        [HttpGet]
        public List<SearchResult> Search([FromBody]SearchModel search)
        {
            if (search == null) return new List<SearchResult>();

            return this._searchService.GetSearchResults(
                search.Latitude,
                search.Longitude,
                SearchType.GetSearchType(search.Type));
        }
    }
}