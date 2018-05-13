using System.Collections.Specialized;
using System.Web.Mvc;
using GSM.Utils;

namespace GSM.Controllers
{
    [Authorize]
    public class InstrumentController : Controller
    {
        // GET: Instrument
        public ActionResult Index()
        {
            var defaultColumnDisplayOrder = new StringCollection { "Name", "MaxAmidites", "IsActive" };
            var userSearchSettings = UserSettingsHelper.InstrumentSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        // GET: Instrument/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }
    }
}
