using System.Collections.Specialized;
using System.Web.Mvc;
using GSM.Infrastructure.Filters;
using GSM.Utils;

namespace GSM.Controllers
{
    [Authorize]
    public class SpeciesController : Controller
    {
        // GET: Target
        public ActionResult Index()
        {
            var defaultColumnDisplayOrder = new StringCollection { "Name", "IsActive" };
            var userSearchSettings = UserSettingsHelper.SpeciesSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        [HasPermission(Permission.CreateEditSpecies)]
        public ActionResult Create()
        {
            return View();
        }

        // GET: Species/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }
    }
}
