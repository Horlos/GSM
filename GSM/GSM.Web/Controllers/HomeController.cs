using System.Web.Mvc;
using Microsoft.Web.Mvc;

namespace GSM.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return this.RedirectToAction<DashboardController>(c => c.Index());
        }

        public ActionResult Dashboard()
        {
            return this.RedirectToAction<DashboardController>(c => c.Index());
        }
    }
}