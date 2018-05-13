using System;
using System.Linq;
using GSM.Data.Models;

namespace GSM.Data.Services.Interfaces
{
    public interface ITargetsService : IDisposable
    {
        Target GetTarget(int targetId);

        IQueryable<Target> GetAllTargets();

        bool IsTargetExists(Target item);

        void CreateTarget(Target item);

        void UpdateTarget(Target item);

        void DeleteTarget(Target item);
        bool HasAssociations(Target target);
    }
}
