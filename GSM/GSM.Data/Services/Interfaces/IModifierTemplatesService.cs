using System.Linq;
using GSM.Data.Models;

namespace GSM.Data.Services.Interfaces
{
    public interface IModifierTemplatesService
    {
        IQueryable<ModifierTemplate> GetAllModifierTemplates();
        ModifierTemplate GetModifierTemplate(int modifierTemplateId);
        void CreateModifierTemplate(ModifierTemplate modifierTemplate);
        void UpdateModifierTemplate(ModifierTemplate modifierTemplate);
        void DeleteModifierTemplate(ModifierTemplate modifierTemplate);
        bool IsModifierTemplateExists(ModifierTemplate modifierTemplate);

    }
}
