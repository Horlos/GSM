using System;
using System.ComponentModel.DataAnnotations;

namespace TriggerDB.API.Models
{
    public class StrandBatchViewModel : APIModelBase
    {
        public int Id { get; set; }
        public int StrandId { get; set; }
        public string ArrowHeadBatchNumber { get; set; }

        [Required(ErrorMessage = "Initiated Date is required.")]
        public DateTime InitiatedDate { get; set; }

        [Required(ErrorMessage = "Position is required.")]
        public string Position { get; set; }

        [Required(ErrorMessage = "RunID is required.")]
        public string RunId { get; set; }

        [Required(ErrorMessage = "Purity is required.")]
        [Range(1, 100, ErrorMessage = "Purity must be a positive number larger than 1 and smaller than 100.")]
        public double Purity { get; set; }

        [Required(ErrorMessage = "Amount Prepared is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Amount Prepared must be a positive number.")]
        public double AmountPrepared { get; set; }

        [Required(ErrorMessage = "Prepared Volume is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Prepared Volume must be a positive number.")]
        public double PreparedVolume { get; set; }

        [Required(ErrorMessage = "Misc Volume Used is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Misc Volume Used must be a positive number.")]
        public double MiscVolumeUsed { get; set; }

        public bool Unavailable { get; set; }

        public Nullable<double> SynthesisScale { get; set; }

        public string Notes { get; set; }

        public double Concentration { get; set; }

        public double RemainingVolume { get; set; }

        public double AmountRemaining { get; set; }
    }
}