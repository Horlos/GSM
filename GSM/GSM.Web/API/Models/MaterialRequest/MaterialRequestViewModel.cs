using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GSM.API.Models.MaterialRequest
{
    public class MaterialRequestViewModel
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public DateTime RequestDate { get; set; }
        public Nullable<DateTime> NeedByDate { get; set; }
        public int SubmittedBy { get; set; }
        public string Notes { get; set; }

        public virtual StatusViewModel Status { get; set; }
        public virtual UserViewModel User { get; set; }
    }
}