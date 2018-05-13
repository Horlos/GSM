using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class Strand : IEntity
    {
        private string _baseSequence;
        private string _sequence;

        public Strand()
        {
            StrandId = "NEW";
        }

        public Strand(string strandId)
        {
            StrandId = string.IsNullOrEmpty(strandId) ? "NEW" : strandId;
        }

        public int Id { get; set; }
        public string StrandId { get; set; }
        public int TargetId { get; set; }
        public int OrientationId { get; set; }
        public string GenomeNumber { get; set; }
        public string GenomePosition { get; set; }
        public string ParentSequence { get; set; }
        public string Notes { get; set; }
        public int FirstPosition { get; set; }
        public decimal? MW { get; set; }
        public decimal? ExtinctionCoefficient { get; set; }

        public string Sequence
        {
            get
            {
                if (string.IsNullOrEmpty(_sequence))
                    BuildSequence();

                return _sequence;
            }
            set { _sequence = value; }
        }

        public string BaseSequence
        {
            get
            {
                if (string.IsNullOrEmpty(_baseSequence))
                    BuildBaseSequence();

                return _baseSequence;
            }
            set { _baseSequence = value; }
        }

        public string ColumnIdentity
        {
            get
            {
                if (StrandModStructures != null)
                {
                    var columnIdentity = StrandModStructures
                        .OrderByDescending(x => x.OrdinalPosition)
                        .Select(s => s.ModStructure.Name)
                        .FirstOrDefault();

                    return columnIdentity;
                }

                return null;
            }
        }

        public virtual Target Target { get; set; }
        public virtual Orientation Orientation { get; set; }

        public virtual ICollection<StrandModStructure> StrandModStructures { get; set; }
        public virtual ICollection<Species> Species { get; set; }
        public virtual ICollection<StrandBatch> Batches { get; set; }

        public virtual ICollection<StrandMaterialRequest> MaterialRequests { get; set; }

        public virtual ICollection<StrandSynthesisRequest> SynthesisRequestStrands { get; set; }

        public void BuildSequence()
        {
            var sequenceBuilder = new StringBuilder();
            var strandModStructures = StrandModStructures ?? Enumerable.Empty<StrandModStructure>();
            var modStructures = strandModStructures
                .OrderBy(m => m.OrdinalPosition)
                .Select(m => m.ModStructure);

            foreach (var modStructure in modStructures)
            {
                if (modStructure != null &&
                    !string.IsNullOrEmpty(modStructure.Name))
                {
                    sequenceBuilder.Append(modStructure.Name);
                }
            }

            _sequence = sequenceBuilder.ToString();
        }

        public void BuildBaseSequence()
        {
            var sequenceBuilder = new StringBuilder();
            var strandModStructures = StrandModStructures ?? Enumerable.Empty<StrandModStructure>();
            var modStructures = strandModStructures
               .OrderBy(m => m.OrdinalPosition)
               .Select(m => m.ModStructure);

            foreach (var modStructure in modStructures)
            {
                if (modStructure != null)
                {
                    var seqBase = modStructure.Base;
                    if (string.IsNullOrEmpty(seqBase))
                        seqBase = " ";

                    sequenceBuilder.Append(seqBase);
                }
            }

            _baseSequence = sequenceBuilder.ToString();
        }


        public void CalculateMW()
        {
            MW = 0;
            var modList = StrandModStructures.ToList();
            decimal result = 0;
            modList.ForEach(item =>
            {
                if (item.ModStructure != null)
                {
                    result = result + item.ModStructure.IncorporatedMW;
                }

            });
            result = result > 61.96m ? result - 61.96m : 0;
            MW = result;
        }

        //calculate this strands extinction coefficient using the nearest neighbor method
        public void CalculateEC()
        {
            decimal result = 0;
            try
            {
                var pairValueLookup = CreatePairLookup();
                var monomerLookup = CreateMonomerLookup();
                char previousChar = new char();
                foreach (char c in BaseSequence)
                {
                    if (previousChar != '\0')
                    {
                        string lookupKey = new string(new char[] { previousChar, c });
                        result = result + ((pairValueLookup[lookupKey] * 2) - monomerLookup[c]);
                    }
                    previousChar = c;
                }
                //the very last monomer value needs to be added back in
                result = result + monomerLookup[previousChar];

                ExtinctionCoefficient = result;
            }
            catch (Exception)
            {
                //if any characters are found in the base sequence that are not in our lookup tables, we cannot proceed with the calculation
                //just abort and change it to 0
                //todo log the exception
                ExtinctionCoefficient = 0;

            }
        }

        private static Dictionary<string, decimal> CreatePairLookup()
        {
            var result = new Dictionary<string, decimal>
            {
                {"AA", 13.7m},
                {"AC", 10.6m},
                {"AG", 12.5m},
                {"AT", 11.4m},
                {"CA", 10.6m},
                {"CC", 7.3m},
                {"CG", 9m},
                {"CT", 7.6m},
                {"GA", 12.6m},
                {"GC", 8.8m},
                {"GG", 10.8m},
                {"GT", 10.0m},
                {"TA", 11.7m},
                {"TC", 8.1m},
                {"TG", 9.5m},
                {"TT", 8.4m},
                {"AU", 12m},
                {"CU", 8.1m},
                {"GU", 10.6m},
                {"UA", 12.3m},
                {"UC", 8.6m},
                {"UG", 10m},
                {"UU", 9.8m},
                {"TU", 9.1m},
                {"UT", 9.1m}
            };

            return result;

        }

        private static Dictionary<char, decimal> CreateMonomerLookup()
        {
            var result = new Dictionary<char, decimal>
            {
                {'A', 15.4m},
                {'C', 7.4m},
                {'G', 11.5m},
                {'U', 9.9m},
                {'T', 8.7m}
            };

            return result;
        }
    }
}
