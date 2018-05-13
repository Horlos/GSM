using GSM.API.Controllers;

namespace GSM.API.Models
{
    public class ListOptions
    {
        public ListOptions()
        {
            pageNo = 1;
            pageSize = 10;
        }

        public string filterText { get;set;} 
        
        
        public int? pageNo {get;set;} 
       
        
        public int? pageSize {get;set;} 
        
        public string sortBy {get;set;}

        public SortOrder? sortOrder { get; set; }

    }

}