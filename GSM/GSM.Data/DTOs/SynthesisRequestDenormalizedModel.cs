using System;
using GSM.Data.Models;

namespace GSM.Data.DTOs
{
    public class SynthesisRequestDenormalizedModel
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime? Needed { get; set; }
        public DateTime? DateCompleted { get; set; }
        public string RequestedBy { get; set; }
        public string Notes { get; set; }
        public string SetDetail { get; set; }

        public RequestStatus Status { get; set; }
        public StrandSynthesisRequest StrandSynthesisRequest { get; set; }
        public int MaterialRequestId { get; set; }
    }
}
