using System;
using System.Linq;
using GSM.Data.DTOs;
using GSM.Data.Models;
using GSM.Data.Services.Interfaces;

namespace GSM.Data.Services
{
    public class MaterialRequestsService : IMaterialRequestsService
    {
        private readonly GeneSythesisDBContext _db;

        public MaterialRequestsService(GeneSythesisDBContext dbContext)
        {
            _db = dbContext;
        }

        public IQueryable<MaterialRequest> GetAll()
        {
            return _db.MaterialRequests.AsNoTracking();
        }

        public IQueryable<MaterialRequestDenormalizedModel> GetDenormalizedMaterialRequests()
        {
            var result = _db.MaterialRequests.Join(_db.DuplexMaterialRequests, d => d.Id, s => s.MaterialRequestId,
                (d, s) => new MaterialRequestDenormalizedModel
                {
                    Id = d.Id,
                    StatusId = d.StatusId,
                    Notes = d.Notes,
                    Status = d.Status,
                    RequestDate = d.RequestDate,
                    NeedByDate = d.NeedByDate,
                    SubmittedBy = d.SubmittedBy,
                    SetDetail = d.SetDetail,
                    User = d.User,
                    DuplexMaterialRequest = s,
                });

            return result;
        }

        public MaterialRequest GetMaterialRequest(int materialRequestId)
        {
            return _db.MaterialRequests.FirstOrDefault(m => m.Id == materialRequestId);
        }

        public void Create(MaterialRequest materialRequest)
        {
            var status = _db.Status.FirstOrDefault(s => s.Description.Equals("Submitted"));
            if (status != null)
            {
                materialRequest.StatusId = status.Id;
                materialRequest.RequestDate = DateTime.Now;
                _db.SetEntityStateAdded(materialRequest);
                _db.SaveChanges();
            }
        }

        public void Update(MaterialRequest materialRequest)
        {
            materialRequest.Status = null;
            _db.SetEntityStateModified(materialRequest);
            _db.DeleteOrphans();
            _db.SaveChanges();
        }

        public void Delete(MaterialRequest materialRequest)
        {
            var listDuplexes = materialRequest.RequestedDuplexes.ToList();
            foreach (var requestedDuplex in listDuplexes)
                _db.SetEntityStateDeleted(requestedDuplex);

            var listStrands = materialRequest.RequestedStrands.ToList();
            foreach (var requestedStrand in listStrands)
                _db.SetEntityStateDeleted(requestedStrand);

            _db.SetEntityStateDeleted(materialRequest);
            _db.SaveChanges();
        }

        public bool IsStatusExists(int statusId)
        {
            return _db.Status.Any(s => s.Id == statusId);
        }

        private bool _disposed;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        private void Dispose(bool disposing)
        {
            if (_disposed) return;

            if (disposing)
                _db.Dispose();

            _disposed = true;
        }
    }
}
