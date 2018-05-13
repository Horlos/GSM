using System;

namespace GSM.API.Models.Duplex
{
	public class DuplexBatchInfoViewModel
	{
		public int Id { get; set; }
		public string DuplexBatchNumber { get; set; }
		public DateTime PreparedDate { get; set; }
		public double? AmountRemaining { get; set; }
		public bool Unavailable { get; set; }
	}
}