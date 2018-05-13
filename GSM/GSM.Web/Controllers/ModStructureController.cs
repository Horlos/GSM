using System.Collections.Specialized;
using System.Web.Mvc;
using GSM.Infrastructure.Filters;
using GSM.Utils;

namespace GSM.Controllers
{
    [Authorize]
    public class ModStructureController : Controller
    {
        // GET: Target
        public ActionResult Index()
        {
            var defaultColumnDisplayOrder = new StringCollection { "Name", "Base", "StartingMaterialMW", "VendorName", "VendorCatalogNumber", "Coupling", "Deprotection", "IncorporatedMW", "Formula" };
            var userSearchSettings = UserSettingsHelper.ModStructureSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        [HasPermission(Permission.ManageModStructure)]
        public ActionResult Create()
        {
            return View();
        }

        // GET: Species/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }
    }
}
