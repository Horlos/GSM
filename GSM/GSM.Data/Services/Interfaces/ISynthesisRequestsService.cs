using System;
using System.Linq;
using GSM.Data.DTOs;
using GSM.Data.Models;

namespace GSM.Data.Services.Interfaces
{
    public interface ISynthesisRequestsService : IDisposable
    {
        SynthesisRequest GetSynthesisRequest(int synthesisRequestId);
        IQueryable<SynthesisRequest> GetAll();
        IQueryable<SynthesisRequestDenormalizedModel> GetDenormalizedSynthesisRequests();
        void CreateSynthesisRequest(SynthesisRequest synthesisRequest);
        void UpdateSynthesisRequest(SynthesisRequest synthesisRequest);
        void DeleteSynthesisRequest(SynthesisRequest synthesisRequest);
        bool IsStatusExists(int statusId);
    }
}
