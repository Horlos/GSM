using System;

namespace GSM.API.Models.SynthesisRequest
{
    public class SynthesisRequestDenormalizedViewModel
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public Nullable<DateTime> RequestDate { get; set; }
        public Nullable<DateTime> Needed { get; set; }
        public Nullable<DateTime> DateCompleted { get; set; }
        public string RequestedBy { get; set; }
        public string Notes { get; set; }
        public string SetDetail { get; set; }

        public int MaterialRequestId { get; set; }
        public StatusViewModel Status { get; set; }
        public StrandSynthesisRequestViewModel StrandSynthesisRequest { get; set; }
    }
}