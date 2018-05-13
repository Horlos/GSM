using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http;
using GSM.Data.Models;
using WebGrease.Css.Extensions;
using GSM.Utils;

namespace GSM.API.Controllers
{
    [Authorize]
    public class ModifiedSequenceController : ApiController
    {
        private GeneSythesisDBContext db = new GeneSythesisDBContext();

        [HttpGet]
        [Route("api/modifiers/{modifierTemplateId}/{strandId}")]
        public IHttpActionResult GetStrandApplyModifierTemplate(int modifierTemplateId, int strandId)
        {
            var item = db.ModifierTemplates.Find(modifierTemplateId);
            var strand = db.Strands.Find(strandId);
            if (item != null && strand != null)
            {
                var modifierTemplateMods = GetModifierTemplateMods(item.ModifierTemplatePositions);
                var result = ModifierUtils.GetModifiedAsString((int)strand.FirstPosition, strand.BaseSequence, item.FirstPosition, modifierTemplateMods);
                return Json(new
                {
                    ModifiedSequence = result,
                    ModifierTemplateName = item.Name, 
                    item.FirstPosition,
                    StrandId = strand.Id,
                    HasErrors = Duplicate(result.NoDelimiter())
                });
            }

            return null;
        }

        [HttpGet]
        [Route("api/modifiers/{modifierTemplateId}/{baseSequence}/{firstPosition}")]
        public IHttpActionResult GetStrandApplyModifierTemplateWithFirstPosition(int modifierTemplateId, string baseSequence, int firstPosition)
        {
            var item = db.ModifierTemplates.Find(modifierTemplateId);
            if (item != null)
            {
                var modifierTemplateMods = GetModifierTemplateMods(item.ModifierTemplatePositions);
                var result = ModifierUtils.GetModifiedAsString(firstPosition, baseSequence, item.FirstPosition, modifierTemplateMods);
                return Json(new
                {
                    ModifiedSequence = result,
                    ModifierTemplateName = item.Name,
                    item.FirstPosition,
                    HasErrors = Duplicate(result.NoDelimiter())
                });
            }

            return null;
        }

        private string GetModifierTemplateMods(IEnumerable<ModifierTemplatePosition> modifierTemplatePositions)
        {
            var result = new StringBuilder();
            modifierTemplatePositions.ForEach(mods => result.Append(mods.Mod + ","));
            result.Remove(result.Length - 1, 1);
            return result.ToString();
        }

        private bool Duplicate(string modified)
        {
            if (db.Strands.Any(m => m.Sequence == modified))
            {
                return true;
            }
            return false;
        }
    }
}