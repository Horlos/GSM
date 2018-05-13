using System.Collections.Specialized;
using System.Web.Mvc;
using GSM.Infrastructure.Filters;
using GSM.Utils;

namespace GSM.Controllers
{
    [Authorize]
    public class MaterialRequestController : Controller
    {
        // GET: Target
        public ActionResult Index()
        {
            var defaultColumnDisplayOrder = new StringCollection { "Id", "RequestDate", "NeedByDate", "Status.Description" };
            var userSearchSettings = UserSettingsHelper.MaterialRequestSearchSettings;
            UserSettingsHelper.SetDefaultSearchSettings(userSearchSettings, defaultColumnDisplayOrder);
            return View();
        }

        // GET: MaterialRequestController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: MaterialRequestController/Create
        [HasPermission(Permission.CreateMaterialRequest)]
        public ActionResult Create()
        {
            return View();
        }

        // GET: MaterialRequestController/Edit/5
        [HasPermission(Permission.CreateMaterialRequest, Permission.UpdateMaterialRequestStatus)]
        public ActionResult Edit(int id)
        {
            return View();
        }
    }
}
