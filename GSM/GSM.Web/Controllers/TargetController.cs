using System.Collections.Specialized;
using System.Web.Mvc;
using GSM.Infrastructure.Filters;
using GSM.Utils;

namespace GSM.Controllers
{
    [Authorize]
    public class TargetController : Controller
    {
        // GET: Target
        public ActionResult Index()
        {
            var defaultColumnDisplayOrder = new StringCollection { "Name", "IsActive" };
            var userSearchSettings = UserSettingsHelper.TargetSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        // GET: Tether/Create
        [HasPermission(Permission.CreateEditTargets)]
        public ActionResult Create()
        {
            return View();
        }

        // GET: Target/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }
    }
}
