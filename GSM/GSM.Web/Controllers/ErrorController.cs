using System.Web.Mvc;

namespace GSM.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        public ActionResult AccessDenied()
        {
            return View("Errors/403");
        }
    }
}