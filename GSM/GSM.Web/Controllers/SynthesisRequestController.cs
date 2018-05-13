using System.Collections.Specialized;
using System.Web.Mvc;
using GSM.Infrastructure.Filters;
using GSM.Utils;

namespace GSM.Controllers
{
    [Authorize]
    public class SynthesisRequestController : Controller
    {
        // GET: SynthesisRequest
        public ActionResult Index()
        {
            var defaultColumnDisplayOrder = new StringCollection { "Id", "RequestDate", "Needed", "Status.Description" };
            var userSearchSettings = UserSettingsHelper.SynthesisRequestSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        // GET: SynthesisRequest/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: SynthesisRequest/Create
        [HasPermission(Permission.CreateSynthesisRequest)]
        public ActionResult Create()
        {
            return View();
        }

        // GET: SynthesisRequest/Edit/5
        [HasPermission(Permission.CreateSynthesisRequest, Permission.UpdateSynthesisRequestStatus)]
        public ActionResult Edit(int id)
        {
            return View();
        }

        public ActionResult ExportSequence()
        {
            return View();
        }
    }
}
