using System;
using System.Collections.Generic;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class MaterialRequest: IEntity
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? NeedByDate { get; set; }
        public int SubmittedBy { get; set; }
        public string Notes { get; set; }
        public string SetDetail { get; set; }

        public virtual RequestStatus Status { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<DuplexMaterialRequest> RequestedDuplexes { get; set; }
        public virtual ICollection<StrandMaterialRequest> RequestedStrands { get; set; }
        public virtual ICollection<SynthesisRequest> SynthesisRequests { get; set; }
    }
}
