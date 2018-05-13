using System;
using GSM.Data.Models;

namespace GSM.Data.DTOs
{
    public class MaterialRequestDenormalizedModel
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? NeedByDate { get; set; }
        public int SubmittedBy { get; set; }
        public string Notes { get; set; }
        public string SetDetail { get; set; }

        public RequestStatus Status { get; set; }
        public User User { get; set; }
        public DuplexMaterialRequest DuplexMaterialRequest { get; set; }
    }
}
