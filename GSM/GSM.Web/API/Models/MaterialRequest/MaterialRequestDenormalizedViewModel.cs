using System;

namespace GSM.API.Models.MaterialRequest
{
    public class MaterialRequestDenormalizedViewModel
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? NeedByDate { get; set; }
        public int SubmittedBy { get; set; }
        public string Notes { get; set; }
        public string SetDetail { get; set; }

        public StatusViewModel Status { get; set; }
        public UserViewModel User { get; set; }
        public DuplexMaterialRequestViewModel DuplexMaterialRequest { get; set; }
    }
}