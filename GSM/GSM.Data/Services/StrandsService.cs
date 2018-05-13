using System.Collections.Generic;
using System.Linq;
using System.Text;
using GSM.Data.Models;

namespace GSM.Data.Services
{
    public class StrandsService
    {
        private const string Antisense = "Antisense";
        private const string Sense = "Sense";
        private const string SenseIdent = "SS";
        private const string AntisenseIdent = "AS";
        private readonly GeneSythesisDBContext _db;

        public StrandsService()
        {
            _db = new GeneSythesisDBContext();
        }

        public void CreateStrandBatch(StrandBatch strandBatch)
        {
            var strandId = strandBatch.StrandId;
            var strand = _db.Strands.Find(strandId);
            if (strand != null && !IsStrandBatchExist(strandBatch))
            {
                strand.Batches.Add(strandBatch);
                _db.SetEntityStateAdded(strandBatch);
                _db.SetEntityStateModified(strand);
                _db.SaveChanges();
            }
        }

        public bool CombineBatches(StrandBatch strandBatch, IEnumerable<int> combinedBatches)
        {
            var strandId = strandBatch.StrandId;
            var strand = _db.Strands.Find(strandId);
            if (strand != null && !IsStrandBatchExist(strandBatch))
            {
                var notesBuilder = new StringBuilder("Combined from batches: ");
                foreach (var batchId in combinedBatches)
                {
                    var combinedBatch = GetStrandBatch(strandId, batchId);
                    if (combinedBatch == null)
                        return false;

                    notesBuilder.Append(string.Format("<{0}>, ", combinedBatch.BatchNumber));
                    combinedBatch.Notes = string.Format("Combined into batch <{0}> \n{1}",
                        strandBatch.BatchNumber, combinedBatch.Notes);
                    combinedBatch.MiscVolumeUsed = combinedBatch.PreparedVolume ?? 0;
                    _db.SetEntityStateModified(combinedBatch);

                }

                strandBatch.Notes = notesBuilder.Remove(notesBuilder.Length - 2, 2)
                    .Append(string.Format("\n{0}", strandBatch.Notes))
                    .ToString();

                strand.Batches.Add(strandBatch);
                _db.SetEntityStateAdded(strandBatch);
                _db.SetEntityStateModified(strand);
                var result = _db.SaveChanges();
                return result > 0;
            }

            return false;
        }

        public void SplitStrandBatch(StrandBatch sourceBatch, IEnumerable<StrandBatch> splittedBatches)
        {
            var strand = GetStrand(sourceBatch.StrandId);
            if (strand != null)
            {
                sourceBatch.MiscVolumeUsed = sourceBatch.PreparedVolume ?? 0;
                var notesBuilder = new StringBuilder()
                    .AppendFormat("{0}\n", sourceBatch.Notes)
                    .Append("This batch was split into batches ");

                foreach (var batch in splittedBatches)
                {
                    notesBuilder.AppendFormat("{0} and ", batch.BatchNumber);
                    if (!IsStrandBatchExist(batch))
                    {
                        _db.SetEntityStateAdded(batch);
                        strand.Batches.Add(batch);
                    }
                }

                notesBuilder.Remove(notesBuilder.Length - 5, 5);
                sourceBatch.Notes = notesBuilder.ToString();
                _db.SetEntityStateModified(sourceBatch);
                _db.SetEntityStateModified(strand);
                _db.SaveChanges();
            }
        }

        public void UpdateStrandBatch(StrandBatch strandBatch)
        {
            if (!IsStrandBatchExist(strandBatch))
            {
                //var oldStrand = _db.Strands.Find(model.StrandId);
                //if (oldStrand != null)
                //{
                //    oldStrand.Batches.Remove(strandBatch);
                //    _db.Entry(oldStrand).State = EntityState.Modified;
                //}


                //var newStrand = _db.Strands.Find(strandId);
                //if (newStrand != null)
                //{
                //    newStrand.Batches.Add(strandBatch);
                //    _db.Entry(newStrand).State = EntityState.Modified;
                //}

                _db.SetEntityStateModified(strandBatch);
                _db.SaveChanges();
            }
        }

        public StrandBatch GetStrandBatch(int strandBatchId)
        {
            return _db.StrandBatches.Find(strandBatchId);
        }

        public StrandBatch GetStrandBatch(int strandId, int strandBatchId)
        {
            var strand = GetStrand(strandId);
            if (strand != null)
            {
                var strandBatch = strand.Batches.FirstOrDefault(b => b.Id == strandBatchId);
                return strandBatch;
            }

            return null;
        }

        public Strand GetStrand(int strandId)
        {
            return _db.Strands.Find(strandId);
        }

        public IQueryable<Strand> GetStrands(int targetId, string orientation)
        {
            return _db.Strands.Where(s => s.Orientation.Name == orientation && s.TargetId == targetId);
        }

        public IQueryable<Strand> GetStrands()
        {
            return _db.Strands;
        }

        public IQueryable<StrandBatch> GetStrandBatches(int targetId, string orientation)
        {
            return _db.StrandBatches.Where(b => b.Strand.Orientation.Name == orientation && b.Strand.TargetId == targetId);
        }

        public IQueryable<StrandBatch> GetStrandBatches(int strandId)
        {
            return _db.StrandBatches.Where(b => b.StrandId == strandId);
        }

        public IQueryable<StrandBatch> GetStrandBatches()
        {
            return _db.StrandBatches;
        }

        public void CreateStrand(Strand strand)
        {
            if (!IsStrandExists(strand))
            {
                // TODO: implement right way to handle relations between objects.
                var orientation = strand.Orientation.Name;
                strand.Target = null;
                strand.Orientation = null;

                PopulateSpecies(strand);
                PopulateModStructures(strand);
                _db.SetEntityStateAdded(strand);
                _db.SaveChanges();

                // todo: PH (after addition of StrandModStructure table)
                //item.MW = CalculateMW(item.BaseSequence, item.Sequence);
                //item.ExtinctionCoefficient = CalculateEC(item.BaseSequence, item.Sequence);
                foreach (var modStructure in strand.StrandModStructures)
                    _db.Entry(modStructure).Reference(c => c.ModStructure).Load();

                strand.CalculateMW();
                strand.CalculateEC();
                strand.BuildSequence();
                strand.BuildBaseSequence();
                strand.StrandId = GetNextStrandId(strand.Id, orientation);
                _db.SetEntityStateModified(strand);
                _db.SaveChanges();
            }
        }

        public void UpdateStrand(Strand strand)
        {
            if (!IsStrandExists(strand))
            {
                var orientation = strand.Orientation.Name;
                strand.StrandId = GetUpdatedStrandId(strand.StrandId, orientation);

                strand.CalculateMW();
                strand.CalculateEC();
                strand.BuildSequence();
                strand.BuildBaseSequence();

                strand.Orientation = null;
                strand.Target = null;
                PopulateSpecies(strand);
                PopulateModStructures(strand);

                _db.SetEntityStateModified(strand);
                _db.SaveChanges();
            }
        }

        public void MergeStrand(Strand strand)
        {
            var strandId = strand.Id;
            strand.Id = 0;

            if (!IsStrandExists(strand))
            {
                var sourceStrand = GetStrand(strandId);
                if (sourceStrand != null)
                {
                    strand.ExtinctionCoefficient = sourceStrand.ExtinctionCoefficient;
                    strand.GenomeNumber = sourceStrand.GenomeNumber;
                    strand.GenomePosition = sourceStrand.GenomePosition;
                    strand.MW = sourceStrand.MW;
                    strand.Notes = sourceStrand.Notes;
                    strand.OrientationId = sourceStrand.Orientation.Id;
                    strand.ParentSequence = sourceStrand.ParentSequence;
                    strand.TargetId = sourceStrand.Target.Id;
                    strand.Species = sourceStrand.Species;

                    _db.SetEntityStateAdded(strand);
                    _db.SaveChanges();

                    foreach (var modStructure in strand.StrandModStructures)
                        _db.Entry(modStructure).Reference(a => a.ModStructure).Load();

                    strand.BuildSequence();
                    strand.BuildBaseSequence();
                    strand.StrandId = GetNextStrandId(strand.Id, strand.Orientation.Name);
                    _db.SetEntityStateModified(strand);
                    _db.SaveChanges();
                }
            }
        }

        public void DeleteStrand(Strand strand)
        {
            strand.Species.Clear();
            _db.StrandModStructures.RemoveRange(_db.StrandModStructures.Where(m => m.StrandId == strand.Id));
            _db.SetEntityStateDeleted(strand);
            _db.SaveChanges();
        }

        public bool IsStrandExists(Strand strand)
        {
            return _db.Strands.Where(m => m.Sequence == strand.Sequence && m.Id != strand.Id)
                .ToList()
                .Any(m => m.Sequence == strand.Sequence);
        }

        public bool IsStrandBatchExist(StrandBatch strandBatch)
        {
            return _db.StrandBatches.Where(m => m.BatchNumber == strandBatch.BatchNumber && strandBatch.Id != m.Id)
                .ToList()
                .Any(m => m.BatchNumber == strandBatch.BatchNumber);
        }

        public bool HasAssociations(int strandId)
        {
            return _db.MaterialRequests.Any(m => m.RequestedStrands.Any(match => match.StrandId == strandId)) ||
                   _db.SynthesisRequests.Any(m => m.SynthesisRequestStrands.Any(match => match.StrandId == strandId));
        }

        // TODO: Extract to better place
        public ModStructure GetModStructureByName(string modStructureName)
        {
            return
                _db.ModStructures.Where(m => m.Name == modStructureName)
                    .ToList()
                    .FirstOrDefault(m => m.Name == modStructureName);
        }
        public Orientation GetOrientationByName(string orientationName)
        {
            return _db.Orientations.Where(m => m.Name == orientationName)
                    .ToList()
                    .FirstOrDefault(m => m.Name == orientationName);
        }

        public Target GetTargetByName(string targetName)
        {
            return _db.Targets.Where(m => m.Name == targetName)
                    .ToList()
                    .FirstOrDefault(m => m.Name == targetName);
        }

        private void PopulateSpecies(Strand strand)
        {
            if (strand.Species != null)
            {
                var speciesList = strand.Species.ToList();
                strand.Species.Clear();
                foreach (var species in speciesList)
                {
                    var match = _db.SpeciesList.FirstOrDefault(s => s.Id == species.Id);
                    if (match != null)
                    {
                        match.Strands.Add(strand);
                        strand.Species.Add(match);
                    }
                }
            }
        }

        private void PopulateModStructures(Strand strand)
        {
            if (strand.StrandModStructures != null)
            {
                var strandModStructures = strand.StrandModStructures.ToList();
                strand.StrandModStructures.Clear();
                foreach (var strandModStructure in strandModStructures)
                {
                    var strandMod = new StrandModStructure
                    {
                        ModStructureId = strandModStructure.ModStructureId,
                        OrdinalPosition = strandModStructure.OrdinalPosition,
                        StrandId = strand.Id,
                        Strand = null,
                        ModStructure = null
                    };
                    _db.StrandModStructures.Add(strandMod);
                }
                strandModStructures.Clear();
            }
        }

        private string GetUpdatedStrandId(string strandId, string orientation)
        {
            return orientation == Antisense
                ? strandId.Replace(string.Format("-{0}", SenseIdent), string.Format("-{0}", AntisenseIdent))
                : strandId.Replace(string.Format("-{0}", AntisenseIdent), string.Format("-{0}", SenseIdent));
        }

        private string GetNextStrandId(int seedId, string orientation)
        {
            var senseIdent = orientation == Antisense ? AntisenseIdent : SenseIdent;
            return string.Format("AM{0}-{1}", seedId.ToString("D5"), senseIdent);
        }
    }
}
