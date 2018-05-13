using System.Collections.Generic;

namespace GSM.API.Models
{
    public class SearchResult<T>
    {
        public IEnumerable<T> ItemList { get; set; }
        public int TotalItems { get; set; }
    }
}