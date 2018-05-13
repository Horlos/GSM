using System.Collections.Generic;
using GSM.API.Models.Duplex;

namespace GSM.API.Models
{
    public class DuplexModel : APIModelBase
    {

        public int Id { get; set; }
        public string DuplexId { get; set; }
        public decimal? MW { get; set; }
        public string Notes { get; set; }
        public TargetViewModel Target { get; set; }
        public StrandViewModel AntiSenseStrand { get; set; }
        public StrandViewModel SenseStrand { get; set; }
        public ICollection<DuplexBatchInfoViewModel> Batches { get; set; }
    }
}