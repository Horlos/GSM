using System.Linq;
using System.Web.Http;
using AutoMapper.QueryableExtensions;
using GSM.API.Models;
using GSM.Data.Models;

namespace GSM.API.Controllers
{
    [Authorize]
    public class StatusController : ApiController
    {

        private GeneSythesisDBContext db;

        public StatusController()
        {
            db = new GeneSythesisDBContext();
        }

        [HttpGet]
        [Route("api/status")]
        public IHttpActionResult Get()
        {
            var statuses = db.Status.ProjectTo<StatusViewModel>().ToList();
            return Ok(statuses);
        }
    }
}
