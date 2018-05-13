using System.Web.Mvc;

namespace GSM.Controllers
{
    [Authorize]
    public class LookupController : Controller
    {
        // GET: Target
        [Route("Lookup")]
        [Route("Lookup/Targets", Name = "Targets")]
        [Route("Lookup/Instruments", Name = "Instruments")]
        [Route("Lookup/Species", Name = "Species")]
        [Route("Lookup/Strands", Name = "Strands")]
        [Route("Lookup/Duplexes", Name = "Duplexes")]
        [Route("Lookup/ModStructures", Name = "ModStructures")]
        public ActionResult Index()
        {
            //var userSearchSettings = UserSettingsHelper.TargetSearchSettings;
            //var defaultColumnDisplayOrder = new StringCollection { "Name", "IsActive" };
            //SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }
    }
}
