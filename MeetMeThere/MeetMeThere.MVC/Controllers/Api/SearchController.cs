using System;
using System.Collections.Generic;
using System.Web.Http;

using MeetMeThere.MVC.Google.Model;
using MeetMeThere.MVC.Models;
using MeetMeThere.MVC.Service;

namespace MeetMeThere.MVC.Controllers.Api
{
    //[SecureAPI]
    [RoutePrefix("api/search")]
    public class SearchController : ApiController //: SecureController.SecureController
    {
        private readonly SearchService _searchService;

        public SearchController()
        {
            this._searchService = new SearchService();
        }

        [Route("")]
        [HttpPost]
        public List<SearchResult> Search(SearchModel search)
        {
            if (search == null) return new List<SearchResult>();

            return this._searchService.GetSearchResults(
                search.Latitude,
                search.Longitude,
                SearchType.GetSearchType(search.Type));
        }
    }
}