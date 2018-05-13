using System.Collections.Specialized;
using System.Web.Mvc;
using Microsoft.Web.Mvc;
using GSM.Infrastructure.Filters;
using GSM.Utils;

namespace GSM.Controllers
{
    [Authorize]
    public class DuplexController : Controller
    {

        // GET: Duplex
        public ActionResult Index()
        {
            var defaultColumnDisplayOrder = new StringCollection { "DuplexId", "Target.Name", "SenseStrand.StrandId", "AntiSenseStrand.StrandId" };
            var userSearchSettings = UserSettingsHelper.DuplexSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        [ActionName("Batches")]
        public ActionResult DuplexBatches()
        {
            var defaultColumnDisplayOrder = new StringCollection { "DuplexBatchNumber", "PreparedDate", "Target.Name", "RunId", "DuplexId", "Unavailable" };
            var userSearchSettings = UserSettingsHelper.DuplexBatchSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View("DuplexBatches");
        }

        [HasPermission(Permission.CreateDuplex)]
        public ActionResult Create()
        {
            return View();
        }

        // GET: Duplex/Create
        [HasPermission(Permission.CreateDuplex)]
        public ActionResult CreateDuplexes()
        {
            return View();
        }

        // GET: Duplex/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return this.RedirectToAction<HomeController>(c => c.Index());
            }

            return View();
        }

        [HasPermission(Permission.CreateDuplexBatch)]
        public ActionResult CreateDuplexBatch()
        {
            return View();
        }

        public ActionResult EditDuplexBatch(int? id)
        {
            return View();
        }

        [HasPermission(Permission.ImportDuplexes)]
        public ActionResult Import()
        {
            return View("ImportDuplexes");
        }

        [HasPermission(Permission.ImportDuplexes)]
        public PartialViewResult ImportDuplexes()
        {
            return PartialView("_ImportDuplexes");
        }

        [HasPermission(Permission.ImportDuplexes)]
        public PartialViewResult EditImportedDuplex()
        {
            return PartialView("_EditImportedDuplex");
        }
    }
}
