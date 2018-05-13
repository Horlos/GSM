using System;
using System.Linq;
using GSM.Data.DTOs;
using GSM.Data.Models;

namespace GSM.Data.Services.Interfaces
{
    public interface IMaterialRequestsService : IDisposable
    {
        IQueryable<MaterialRequest> GetAll();
        IQueryable<MaterialRequestDenormalizedModel> GetDenormalizedMaterialRequests();
        MaterialRequest GetMaterialRequest(int materialRequestId);
        void Create(MaterialRequest materialRequest);
        void Update(MaterialRequest materialRequest);
        void Delete(MaterialRequest materialRequest);
        bool IsStatusExists(int statusId);
    }
}
