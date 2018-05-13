using System.Collections.Specialized;
using System.Web.Mvc;
using GSM.Infrastructure.Filters;
using GSM.Utils;

namespace GSM.Controllers
{
    [Authorize]
    public class ModifierTemplateController : Controller
    {
        public ActionResult Index()
        {
            var defaultColumnDisplayOrder = new StringCollection { "Name", "Orientation.Name" };
            var userSearchSettings = UserSettingsHelper.ModifierTemplateSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        [HasPermission(Permission.ManageModifierTemplates)]
        public ActionResult Create()
        {
            return View();
        }

        public ActionResult Edit(int? id)
        {
            return View();
        }
    }
}
