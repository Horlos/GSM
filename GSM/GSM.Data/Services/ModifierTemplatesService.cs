using System.Linq;
using GSM.Data.Models;
using GSM.Data.Services.Interfaces;

namespace GSM.Data.Services
{
    public class ModifierTemplatesService : IModifierTemplatesService
    {
        private readonly GeneSythesisDBContext _db;

        public ModifierTemplatesService(GeneSythesisDBContext dbContext)
        {
            _db = dbContext;
        }

        public IQueryable<ModifierTemplate> GetAllModifierTemplates()
        {
            return _db.ModifierTemplates.AsNoTracking();
        }

        public ModifierTemplate GetModifierTemplate(int modifierTemplateId)
        {
            return _db.ModifierTemplates.FirstOrDefault(template => template.Id == modifierTemplateId);
        }

        public void CreateModifierTemplate(ModifierTemplate modifierTemplate)
        {
            modifierTemplate.Orientation = null;
            _db.SetEntityStateAdded(modifierTemplate);
            _db.SaveChanges();
        }

        public void UpdateModifierTemplate(ModifierTemplate modifierTemplate)
        {
            modifierTemplate.Orientation = null;
            _db.SetEntityStateModified(modifierTemplate);
            _db.DeleteOrphans();
            _db.SaveChanges();
        }

        public void DeleteModifierTemplate(ModifierTemplate modifierTemplate)
        {
            var positions = _db.ModifierTemplatePositions
                .Where(t=>t.ModifierTemplateId == modifierTemplate.Id)
                .ToList();

            foreach (var position in positions)
                _db.SetEntityStateDeleted(position);

            _db.SetEntityStateDeleted(modifierTemplate);
            _db.SaveChanges();
        }

        public bool IsModifierTemplateExists(ModifierTemplate modifierTemplate)
        {
            return _db.ModifierTemplates.Where(m => m.Name == modifierTemplate.Name && m.Id != modifierTemplate.Id)
                .ToList()
                .Any(m => m.Name == modifierTemplate.Name);
        }
    }
}
