using System.Collections.Generic;

namespace GSM.API.Models
{
    public class CombineStrandBatchesViewModel
    {
        public IEnumerable<int> CombinedBatches { get; set; }
        public StrandBatchModel StrandBatch { get; set; }
    }
}