using System;
using System.Collections.Generic;
using GSM.API.Models.MaterialRequest;

namespace GSM.API.Models
{
    public class MaterialRequestModel : APIModelBase
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public DateTime RequestDate { get; set; }
        public Nullable<DateTime> NeedByDate { get; set; }
        public int SubmittedBy { get; set; }
        public string Notes { get; set; }

        public virtual StatusViewModel Status { get; set; }
        public virtual UserViewModel User { get; set; }
        public virtual ICollection<DuplexMaterialRequestViewModel> RequestedDuplexes { get; set; }
        public virtual ICollection<StrandMaterialRequestViewModel> RequestedStrands { get; set; }
    }
}