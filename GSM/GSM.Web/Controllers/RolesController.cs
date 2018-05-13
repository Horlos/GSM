using System.Web.Mvc;
using GSM.Infrastructure.Filters;

namespace GSM.Controllers
{
    [Authorize]
    [HasPermission(Permission.ManageRoles)]
    public class RolesController : Controller
    {
        // GET: Roles
        public ActionResult Index()
        {
            return View();
        }
    }
}
