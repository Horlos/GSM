using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using GSM.Data.DTOs;
using GSM.Data.Models;

namespace GSM.Data.Services
{
    public class DuplexesService
    {
        private readonly GeneSythesisDBContext _db;

        public DuplexesService()
        {
            _db = new GeneSythesisDBContext();
        }

        public IQueryable<Duplex> GetDuplexes()
        {
            return _db.Duplexes;
        }

        public Duplex GetDuplex(int duplexId)
        {
            return _db.Duplexes.Find(duplexId);
        }

        public void CreateDuplex(Duplex duplex)
        {
            if (!IsDuplexExists(duplex))
            {
                duplex.MW = duplex.AntiSenseStrand.MW + duplex.SenseStrand.MW;
                duplex.AntiSenseStrand = null;
                duplex.SenseStrand = null;
                duplex.Target = null;
                _db.Entry(duplex).State = EntityState.Added;
                _db.SaveChanges();

                duplex.DuplexId = GetNextDuplexId(duplex.Id);
                _db.Entry(duplex).State = EntityState.Modified;
                _db.SaveChanges();
            }
        }

        public void CreateDuplexes(ICollection<Duplex> duplexes)
        {
            var duplexCount = 0;
            foreach (var duplex in duplexes)
            {
                if (!IsDuplexExists(duplex))
                {
                    duplex.MW = duplex.AntiSenseStrand.MW + duplex.SenseStrand.MW;
                    duplex.AntiSenseStrand = null;
                    duplex.SenseStrand = null;
                    duplex.Target = null;
                    _db.Entry(duplex).State = EntityState.Added;
                    duplexCount++;
                }
            }

            if (duplexCount == duplexes.Count)
            {
                _db.SaveChanges();

                foreach (var duplex in duplexes)
                {
                    duplex.DuplexId = GetNextDuplexId(duplex.Id);
                    _db.Entry(duplex).State = EntityState.Modified;
                }

                _db.SaveChanges();
            }
        }

        public void UpdateDuplex(Duplex duplex)
        {
            duplex.Notes = duplex.Notes;
            duplex.MW = duplex.AntiSenseStrand.MW + duplex.SenseStrand.MW;
            _db.SaveChanges();
        }

        public void DeleteDuplex(Duplex duplex)
        {
            _db.DuplexBatchStrandBatches.RemoveRange(duplex.Batches.SelectMany(ds => ds.DuplexBatchStrandBatches));
            _db.DuplexBatches.RemoveRange(duplex.Batches);

            var materialRequests = _db.DuplexMaterialRequests
              .Where(r => r.DuplexId == duplex.Id)
              .ToList();

            foreach (var request in materialRequests)
                _db.SetEntityStateDeleted(request);

            _db.Entry(duplex).State = EntityState.Deleted;
            _db.SaveChanges();
        }

        public void CreateDuplexBatch(DuplexBatch duplexBatch)
        {
            var duplexId = duplexBatch.DuplexId;
            var duplex = GetDuplex(duplexId);
            if (duplex != null && !IsDuplexBatchExists(duplexBatch))
            {
                foreach (var duplexStrandBatch in duplexBatch.DuplexBatchStrandBatches)
                {
                    var strandBatch = _db.StrandBatches.Find(duplexStrandBatch.StrandBatchId);
                    if (strandBatch != null)
                    {
                        _db.Entry(duplexStrandBatch).State = EntityState.Added;
                    }
                }

                _db.Entry(duplexBatch).State = EntityState.Added;
                _db.Entry(duplex).State = EntityState.Modified;
                _db.SaveChanges();
            }
        }

        public void UpdateDuplexBatch(DuplexBatch duplexBatch)
        {
            var duplexId = duplexBatch.DuplexId;
            var duplex = GetDuplex(duplexId);
            if (duplex != null && !IsDuplexBatchExists(duplexBatch))
            {
                foreach (var duplexStrandBatch in duplexBatch.DuplexBatchStrandBatches)
                {
                    var strandBatch = _db.StrandBatches.Find(duplexStrandBatch.StrandBatchId);
                    if (strandBatch != null)
                    {
                        _db.Entry(duplexStrandBatch).State = EntityState.Added;
                    }
                }

                _db.Entry(duplexBatch).State = EntityState.Modified;
                _db.Entry(duplex).State = EntityState.Modified;
                _db.SaveChanges();
            }
        }

        public IQueryable<DuplexBatch> GetDuplexBatches()
        {
            return _db.DuplexBatches;
        }

        public IQueryable<DuplexBatchDenormalizedModel> GetDenormalizedDuplexBatches()
        {
            var result = _db.DuplexBatches.Join(_db.DuplexBatchStrandBatches, d => d.Id, s => s.DuplexBatchId,
                (d, s) => new DuplexBatchDenormalizedModel
                {
                    Id = d.Id,
                    DuplexBatchNumber = d.DuplexBatchNumber,
                    DuplexId = d.DuplexId,
                    Concentration = d.Concentration,
                    MiscVolumeUsed = d.MiscVolumeUsed,
                    Notes = d.Notes,
                    Position = d.Position,
                    PreparedDate = d.PreparedDate,
                    PreparedVolume = d.PreparedVolume,
                    Purity = d.Purity,
                    RunId = d.RunId,
                    Unavailable = d.Unavailable,
                    Duplex = d.Duplex,
                    StrandBatchId = s.StrandBatchId,
                    TotalUsed = s.TotalUsed,
                    Target = s.StrandBatch.Strand.Target,
                    AntisenseStrandBatch = s.StrandBatch.Strand.Orientation.Name == "Antisense" ? s.StrandBatch : null,
                    SenseStrandBatch = s.StrandBatch.Strand.Orientation.Name == "Sense" ? s.StrandBatch : null
                });

            return result;
        }

        public DuplexBatch GetDuplexBatch(int duplexBatchId)
        {
            return _db.DuplexBatches.Find(duplexBatchId);
        }

        public bool IsDuplexExists(Duplex duplex)
        {
            return _db.Duplexes.Any(d =>
                d.AntiSenseStrandId == duplex.AntiSenseStrandId &&
                d.SenseStrandId == duplex.SenseStrandId);
        }

        public Strand GetStrand(string strandId)
        {
            return _db.Strands.FirstOrDefault(s => s.StrandId == strandId);
        }

        public bool IsDuplexBatchExists(DuplexBatch duplexBatch)
        {
            return
                _db.DuplexBatches.Where(d =>
                        d.DuplexBatchNumber == duplexBatch.DuplexBatchNumber &&
                        d.Id != duplexBatch.Id)
                    .ToList()
                    .Any(d => d.DuplexBatchNumber == duplexBatch.DuplexBatchNumber);
        }

        private string GetNextDuplexId(int seed)
        {
            return string.Format("AD{0}", seed.ToString("D5"));
        }
    }
}
