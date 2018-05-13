using System;
using System.Collections.Generic;
using System.Linq;
using GSM.Data.Models;

namespace GSM.Data.Services.Interfaces
{
    public interface IModStructuresService : IDisposable
    {
        ModStructure GetModStructure(int modStructureId);

        IQueryable<ModStructure> GetAllModStructures();

        bool IsModStructureExists(ModStructure item);

        void CreateModStructure(ModStructure item);

        void UpdateModStructure(ModStructure item);

        void DeleteModStructure(ModStructure item);

        void UpdateAssociations(int modStructureId, ICollection<int> attachmentsIds);

        void UpdateInstrumentModStructures(int modStructureId, ICollection<InstrumentModStructure> updatedModStructures);

        ModStructureAttachment GetAttachement(int attachmentId);

        int InsertAttachment(int attachmentId, string fileName, byte[] data);

        byte[] GetAttachmentBytes(int attachmentId);

        bool HasAssociations(ModStructure modStructure);
    }
}
