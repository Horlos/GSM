using System;
using System.Linq;
using GSM.Data.Models;

namespace GSM.Data.Services.Interfaces
{
    public interface IInstrumentsService : IDisposable
    {
        Instrument GetInstrument(int instrumentId);

        IQueryable<Instrument> GetAllInstruments();

        bool IsInstrumentExists(Instrument item);

        void CreateInstrument(Instrument item);

        void UpdateInstrument(Instrument item);

        void DeleteInstrument(Instrument item);
    }
}
