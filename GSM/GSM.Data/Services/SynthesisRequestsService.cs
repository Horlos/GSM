using System;
using System.Linq;
using GSM.Data.DTOs;
using GSM.Data.Models;
using GSM.Data.Services.Interfaces;

namespace GSM.Data.Services
{
    public class SynthesisRequestsService : ISynthesisRequestsService
    {
        private readonly GeneSythesisDBContext _db;

        public SynthesisRequestsService(GeneSythesisDBContext dbContext)
        {
            _db = dbContext;
        }

        public SynthesisRequest GetSynthesisRequest(int synthesisRequestId)
        {
            return _db.SynthesisRequests.FirstOrDefault(s => s.Id == synthesisRequestId);
        }

        public IQueryable<SynthesisRequest> GetAll()
        {
            return _db.SynthesisRequests.AsNoTracking();
        }

        public IQueryable<SynthesisRequestDenormalizedModel> GetDenormalizedSynthesisRequests()
        {
            var result = _db.SynthesisRequests.Join(_db.SynthesisRequestStrands, request => request.Id,
                    strand => strand.SynthesisRequestId, (request, strand) => new {request, strand})
                .SelectMany(
                    g => g.request.MaterialRequests.Select(materialRequest => new SynthesisRequestDenormalizedModel
                    {
                        Id = g.request.Id,
                        StatusId = g.request.StatusId,
                        Notes = g.request.Notes,
                        DateCompleted = g.request.DateCompleted,
                        Needed = g.request.Needed,
                        RequestDate = g.request.RequestDate,
                        RequestedBy = g.request.RequestedBy,
                        SetDetail = g.request.SetDetail,
                        Status = g.request.Status,
                        StrandSynthesisRequest = g.strand,
                        MaterialRequestId = materialRequest.Id
                    }));

            return result;
        }

        public void CreateSynthesisRequest(SynthesisRequest synthesisRequest)
        {
            RequestStatus status = _db.Status.FirstOrDefault(s => s.Description.Equals("Submitted"));
            if (status != null)
            {
                synthesisRequest.StatusId = status.Id;
                synthesisRequest.RequestDate = DateTime.Now;

                //insert MaterialRequest
                var materialRequests = synthesisRequest.MaterialRequests.ToList();
                synthesisRequest.MaterialRequests.Clear();
                foreach (var request in materialRequests)
                {
                    var materialRequest = _db.MaterialRequests.FirstOrDefault(d => d.Id == request.Id);
                    synthesisRequest.MaterialRequests.Add(materialRequest);
                }

                _db.SetEntityStateAdded(synthesisRequest);
                _db.SaveChanges();
            }
        }

        public void UpdateSynthesisRequest(SynthesisRequest synthesisRequest)
        {
            //insert MaterialRequest
            var materialRequests = synthesisRequest.MaterialRequests.ToList();
            synthesisRequest.MaterialRequests.Clear();
            foreach (var request in materialRequests)
            {
                var materialRequest = _db.MaterialRequests.FirstOrDefault(d => d.Id == request.Id);
                synthesisRequest.MaterialRequests.Add(materialRequest);
            }

            _db.SetEntityStateModified(synthesisRequest);
            _db.DeleteOrphans();
            _db.SaveChanges();
        }

        public void DeleteSynthesisRequest(SynthesisRequest synthesisRequest)
        {
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
