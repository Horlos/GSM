using System;
using System.Collections.Generic;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class SynthesisRequest : IEntity
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime? Needed { get; set; }
        public DateTime? DateCompleted { get; set; }
        public string RequestedBy { get; set; }
        public string Notes { get; set; }
        public string SetDetail { get; set; }

        //Add related Status 
        public virtual RequestStatus Status { get; set; }
        public virtual ICollection<StrandSynthesisRequest> SynthesisRequestStrands { get; set; }
        public virtual ICollection<MaterialRequest> MaterialRequests { get; set; }
    }
}
