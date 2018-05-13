using System;
using System.Linq;
using GSM.Data.Models;

namespace GSM.Data.Services.Interfaces
{
    public interface ISpeciesService : IDisposable
    {
        Species GetSpecies(int spreciesId);

        IQueryable<Species> GetAllSpecies();

        bool IsSpeciesExists(Species item);

        void CreateSpecies(Species item);

        void UpdateSpecies(Species item);

        void DeleteSpecies(Species item);
        bool HasAssociations(Species species);
    }
}
