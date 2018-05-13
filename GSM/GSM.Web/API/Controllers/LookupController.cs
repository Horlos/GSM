using System.Linq;
using GSM.Data.Models;
using System.Dynamic;
using System.Web.Http;

namespace GSM.API.Controllers
{
    [Authorize]
    public class LookupController : ApiController
    {
        private GeneSythesisDBContext db = new GeneSythesisDBContext();

        [Route("api/lookup")]
        public IHttpActionResult Get([FromUri] string[] table)
        {
            if (table == null || table.Length < 1)
                return BadRequest();

            dynamic result = new ExpandoObject();
            foreach (var item in table)
            {
                if (item == "ModStructureTypes")
                {
                    result.ModStructureTypes = GetmodStructureTypes();
                }
                else if (item == "Instruments")
                {
                    result.Instruments = GetInstruments();
                }
                else if (item == "Orientations")
                {
                    result.Orientations = GetOrientations();
                }
                else if (item == "Targets")
                {
                    result.Targets = GetTargets();
                }
                else if (item == "SpeciesList")
                {
                    result.SpeciesList = GetSpecies();
                }
                else if (item == "ModStructures")
                {
                    result.ModStructures = GetModStructures();
                }
            }
   
            return Json(result);
        }

        private object GetInstruments()
        {
            var result =  db.Instruments.OrderBy(m => m.Name);
            return result;
        }

        private object GetmodStructureTypes()
        {
            var result = from modStructureType in db.ModStructureTypes.OrderBy(m => m.Name)
            select new
            {
                modStructureType.Id,
                modStructureType.Name
            };
            return result;
        }

        private object GetOrientations()
        {
            var result = from orientation in db.Orientations.OrderBy(m => m.Name)
            select new
            {
                orientation.Id,
                orientation.Name
            };
            return result;
        }

        private object GetTargets()
        {
            var result = from target in db.Targets.OrderBy(m => m.Name)
                select new
                {
                    target.Id,
                    target.Name
                };
            return result;
        }

        private object GetSpecies()
        {
            var result = db.SpeciesList.OrderBy(m => m.Name);
            return result;
        }

        private object GetModStructures()
        {
            var result = from modStructures in db.ModStructures.OrderBy(m => m.Base)
                select new
                {
                    modStructures.Base,
                    modStructures.Name,
                    modStructures.Id
                };
            return result;
        }
    }
}
