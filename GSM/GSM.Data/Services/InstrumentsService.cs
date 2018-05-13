using System;
using System.Linq;
using GSM.Data.Models;
using GSM.Data.Services.Interfaces;

namespace GSM.Data.Services
{
    public class InstrumentsService : IInstrumentsService
    {
        private readonly GeneSythesisDBContext _db;

        public InstrumentsService(GeneSythesisDBContext context)
        {
            _db = context;
        }

        public Instrument GetInstrument(int instrumentId)
        {
            return _db.Instruments.FirstOrDefault(instrument => instrument.Id == instrumentId);
        }

        public IQueryable<Instrument> GetAllInstruments()
        {
            return _db.Instruments.AsNoTracking();
        }

        public bool IsInstrumentExists(Instrument item)
        {
            return _db.Instruments.Where(m => m.Name == item.Name && m.Id != item.Id)
                .ToList()
                .Any(m => m.Name == item.Name);
        }

        public void CreateInstrument(Instrument item)
        {
            if (!IsInstrumentExists(item))
            {
                _db.SetEntityStateAdded(item);
                _db.SaveChanges();
            }
        }

        public void UpdateInstrument(Instrument item)
        {
            if (!IsInstrumentExists(item))
            {
                _db.SetEntityStateModified(item);
                _db.SaveChanges();
            }
        }

        public void DeleteInstrument(Instrument item)
        {
            var instrumentModStructures = _db.InstrumentModStructures
                .Where(structure => structure.InstrumentId == item.Id)
                .ToList();

            foreach (var modStructure in instrumentModStructures)
                _db.SetEntityStateDeleted(modStructure);

            _db.SetEntityStateDeleted(item);
            _db.SaveChanges();
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
