using System;
using System.Linq;
using GSM.Data.Models;
using GSM.Data.Services.Interfaces;

namespace GSM.Data.Services
{
    public class SpeciesService: ISpeciesService
    {
        private readonly GeneSythesisDBContext _db;

        public SpeciesService()
        {
            _db = new GeneSythesisDBContext();
        }

        public SpeciesService(GeneSythesisDBContext context)
        {
            _db = context;
        }

        public IQueryable<Species> GetAllSpecies()
        {
            return _db.SpeciesList.AsNoTracking();
        }

        public Species GetSpecies(int spreciesId)
        {
            return _db.SpeciesList.FirstOrDefault(species => species.Id == spreciesId);
        }

        public bool IsSpeciesExists(Species item)
        {
            return _db.SpeciesList.Where(m => m.Name == item.Name && m.Id != item.Id)
                .ToList()
                .Any(m => m.Name == item.Name);
        }

        public void CreateSpecies(Species item)
        {
            if (!IsSpeciesExists(item))
            {
                _db.SetEntityStateAdded(item);
                _db.SaveChanges();
            }
        }

        public void UpdateSpecies(Species item)
        {
            if (!IsSpeciesExists(item))
            {
                _db.SetEntityStateModified(item);
                _db.SaveChanges();
            }
        }

        public void DeleteSpecies(Species item)
        {
            _db.SetEntityStateDeleted(item);
            _db.SaveChanges();
        }

        public bool HasAssociations(Species species)
        {
            return species.Strands.Any();
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
