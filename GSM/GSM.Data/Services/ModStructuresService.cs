using System;
using System.Collections.Generic;
using System.Linq;
using GSM.Data.Models;
using GSM.Data.Services.Interfaces;

namespace GSM.Data.Services
{
    public class ModStructuresService : IModStructuresService
    {
        private readonly GeneSythesisDBContext _db;

        public ModStructuresService(GeneSythesisDBContext context)
        {
            _db = context;
        }

        public IQueryable<ModStructure> GetAllModStructures()
        {
            return _db.ModStructures.AsNoTracking();
        }

        public ModStructure GetModStructure(int modStructureId)
        {
            return _db.ModStructures.FirstOrDefault(structure => structure.Id == modStructureId);
        }

        public bool IsModStructureExists(ModStructure item)
        {
            return _db.ModStructures.Where(m => m.Name == item.Name && m.Id != item.Id)
                .ToList()
                .Any(m => m.Name == item.Name);
        }

        public void CreateModStructure(ModStructure item)
        {
            if (!IsModStructureExists(item))
            {
                item.ModStructureType = null;
                item.ModStructureAttachments = null;
                _db.SetEntityStateAdded(item);
                _db.SaveChanges();
            }
        }

        public void UpdateModStructure(ModStructure item)
        {
            if (!IsModStructureExists(item))
            {
                item.ModStructureType = null;
                _db.SetEntityStateModified(item);
                _db.DeleteOrphans();
                _db.SaveChanges();
            }
        }

        public void DeleteModStructure(ModStructure modStructure)
        {
            foreach (var attachment in modStructure.ModStructureAttachments.ToList())
                _db.SetEntityStateDeleted(attachment);

            foreach (var instrumentModStructure in modStructure.InstrumentModStructures.ToList())
                _db.SetEntityStateDeleted(instrumentModStructure);

            _db.SetEntityStateDeleted(modStructure);
            _db.SaveChanges();
        }

        public void UpdateAssociations(int modStructureId, ICollection<int> attachmentsIds)
        {
            var attachments = _db.ModStructureAttachments
                .Where(m => m.ModStructureId == modStructureId)
                .ToList();

            foreach (var attachment in attachments)
            {
                if (attachmentsIds.All(i => i != attachment.Id))
                {
                    _db.SetEntityStateDeleted(attachment);
                }
            }
            _db.SaveChanges();
        }

        public void UpdateInstrumentModStructures(int modStructureId,
            ICollection<InstrumentModStructure> updatedModStructures)
        {
            foreach (var updatedModStructure in updatedModStructures)
            {
                var updateItem = _db.InstrumentModStructures.FirstOrDefault(m =>
                    m.InstrumentId == updatedModStructure.InstrumentId
                    && m.ModStructureId == modStructureId);

                if (!string.IsNullOrEmpty(updatedModStructure.Code))
                {
                    if (updateItem != null)
                    {
                        updateItem.Code = updatedModStructure.Code;
                        _db.SetEntityStateModified(updateItem);
                    }
                    else
                    {
                        _db.InstrumentModStructures.Add(new InstrumentModStructure
                        {
                            InstrumentId = updatedModStructure.InstrumentId,
                            ModStructureId = modStructureId,
                            Code = updatedModStructure.Code
                        });
                    }
                }
                else if (updateItem != null)
                {
                    _db.SetEntityStateDeleted(updateItem);
                }
            }

            _db.SaveChanges();
        }

        public ModStructureAttachment GetAttachement(int attachmentId)
        {
            return _db.ModStructureAttachments.FirstOrDefault(m => m.Id == attachmentId);
        }

        public int InsertAttachment(int id, string fileName, byte[] data)
        {
            var sql =
                "INSERT INTO [dbo].[ModStructureAttachment] ([ModStructureID], [FileName], [Data]) VALUES ({0}, {1}, {2})";
            return _db.ExecuteSqlCommand(sql, id, fileName, data);
        }

        public byte[] GetAttachmentBytes(int attachmentId)
        {
            var blogNames =
                _db.Database.SqlQuery<byte[]>(
                    "SELECT [Data] FROM [dbo].[ModStructureAttachment] WHERE [ModStructureAttachmentID] = {0}",
                    attachmentId);
            return blogNames.FirstOrDefault();
        }

        public bool HasAssociations(ModStructure modStructure)
        {
            return _db.StrandModStructures.Any(m => m.ModStructureId == modStructure.Id);
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
