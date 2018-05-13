using System;
using System.Linq;
using GSM.Data.Models;
using GSM.Data.Services.Interfaces;

namespace GSM.Data.Services
{
    public class TargetsService : ITargetsService
    {
        private readonly GeneSythesisDBContext _db;

        public TargetsService()
        {
            _db = new GeneSythesisDBContext();
        }

        public TargetsService(GeneSythesisDBContext context)
        {
            _db = context;
        }

        public Target GetTarget(int targetId)
        {
            return _db.Targets.FirstOrDefault(target => target.Id == targetId);
        }

        public IQueryable<Target> GetAllTargets()
        {
            return _db.Targets.AsNoTracking();
        }

        public bool IsTargetExists(Target item)
        {
            return _db.Targets.Where(m => m.Name == item.Name && m.Id != item.Id)
                .ToList()
                .Any(m => m.Name == item.Name);
        }

        public void CreateTarget(Target item)
        {
            if (!IsTargetExists(item))
            {
                _db.SetEntityStateAdded(item);
                _db.SaveChanges();
            }
        }

        public void UpdateTarget(Target item)
        {
            if (!IsTargetExists(item))
            {
                _db.SetEntityStateModified(item);
                _db.SaveChanges();
            }
        }

        public void DeleteTarget(Target item)
        {
            _db.SetEntityStateDeleted(item);
            _db.SaveChanges();
        }

        public bool HasAssociations(Target target)
        {
            return _db.Strands.Any(s => s.TargetId == target.Id) || _db.Duplexes.Any(d => d.TargetId == target.Id);
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
