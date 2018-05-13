using System.Collections.Specialized;
using System.Web.Mvc;
using GSM.Infrastructure.Filters;
using GSM.Utils;

namespace GSM.Controllers
{
    [Authorize]
    public class StrandController : Controller
    {
        // GET: Strand
        public ActionResult Index()
        {
            var defaultColumnDisplayOrder = new StringCollection { "StrandId", "GenomeNumber", "GenomePosition", "Sequence", "MW", "BaseSequence", "ExtinctionCoefficient", "ColumnIdentity" };
            var userSearchSettings = UserSettingsHelper.StrandSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        public ActionResult Batches()
        {
            var defaultColumnDisplayOrder = new StringCollection { "BatchNumber", "InitiatedDate", "SynthesisScale", "Purity", "Strand.Sequence", "Strand.MW", "Strand.Target.Name", "AmountPrepared", "Unavailable" };
            var userSearchSettings = UserSettingsHelper.StrandBatchSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        // GET: Strand/Create
        [HasPermission(Permission.CreateStrand)]
        public ActionResult Create()
        {
            return View();
        }

        // GET: Strand/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        // GET: Strand/CreateModifierBatch
        [HasPermission(Permission.CreateStrand)]
        public ActionResult CreateModifierBatch()
        {
            return View("BatchCreate");
        }

        [HasPermission(Permission.CreateStrandBatch)]
        public ActionResult CreateStrandBatch()
        {
            return View();
        }

        public ActionResult EditStrandBatch(int? id)
        {
            if (id == null)
            {
                return RedirectToAction("Index", "Home");
            }

            return View();
        }

        [HasPermission(Permission.CreateStrandBatch)]
        public PartialViewResult CreateBatch()
        {
            return PartialView("_CreateStrandBatch");
        }

        [HasPermission(Permission.CreateStrandBatch)]
        public PartialViewResult SplitStrandBatch()
        {
            return PartialView("_SplitStrandBatch");
        }

        [HasPermission(Permission.ImportStrand)]
        public ActionResult Import()
        {
            return View("ImportStrands");
        }

        [HasPermission(Permission.ImportStrand)]
        public PartialViewResult ImportStrands()
        {
            return PartialView("_ImportStrands");
        }

        [HasPermission(Permission.ImportStrand)]
        public PartialViewResult EditImportedStrand()
        {
            return PartialView("_EditImportedStrand");
        }
    }
}
