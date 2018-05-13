using System.Collections.Generic;

namespace GSM.Data.Models
{
    public partial class RequestStatus
    {
        public int Id { get; set; }
        public string Description { get; set; }

        public virtual ICollection<MaterialRequest> MaterialRequests { get; set; }
        public virtual ICollection<SynthesisRequest> SynthesisRequests { get; set; }
    }
}
