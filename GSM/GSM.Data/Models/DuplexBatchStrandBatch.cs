using GSM.Data.Common;

namespace GSM.Data.Models
{
    public class DuplexBatchStrandBatch : IEntity
    {
        public int DuplexBatchId { get; set; }
        public int StrandBatchId { get; set; }
        public double? TotalUsed { get; set; }

        public virtual DuplexBatch DuplexBatch { get; set; }

        public virtual StrandBatch StrandBatch { get; set; }
    }
}
