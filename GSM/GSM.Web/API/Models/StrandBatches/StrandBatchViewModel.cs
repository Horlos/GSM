using System;

namespace GSM.API.Models
{
	public class StrandBatchViewModel
	{
		public int Id { get; set; }
		public int StrandId { get; set; }
		public string BatchNumber { get; set; }
		public DateTime InitiatedDate { get; set; }
		public double? AmountRemaining { get; set; }
		public double? Purity { get; set; }
		public double? Concentration { get; set; }
		public double? RemainingVolume { get; set; }
		public bool Unavailable { get; set; }
		public OrientationViewModel Orientation { get; set; }
	}
}