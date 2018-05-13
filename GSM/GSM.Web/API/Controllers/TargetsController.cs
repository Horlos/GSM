using System.Collections.Generic;
using GSM.Data.Models;
using System.Net.Http;
using System.Web.Http;
using GSM.Utils;
using System.Collections.Specialized;
using System.Linq;
using System.Web.Http.ValueProviders;
using AutoMapper;
using GSM.API.Models;
using GSM.Data.Services.Interfaces;
using GSM.Infrastructure.Filters;
using Permission = GSM.Infrastructure.Filters.Permission;

namespace GSM.API.Controllers
{
    [Authorize]
    public class TargetsController : BaseController
    {
        private readonly ITargetsService _targetsService;

        public TargetsController(ITargetsService service)
        {
            _targetsService = service;
        }

        [HttpGet]
        [Route("api/targets")]
        public IHttpActionResult Get(string filterText, string sortBy, SortOrder sortOrder, int pageNo, int pageSize)
        {
            try
            {
                // Filter sort and order
                // Take care of the pagination
                var filteredTargets = _targetsService.GetAllTargets()
                    .Filter(filterText);

                var targets = filteredTargets
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .Skip((pageNo - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var totalItems = filteredTargets.Count();
                var items = new List<TargetViewModel>();
                Mapper.Map(targets, items);
                var result = new SearchResult<TargetViewModel>
                {
                    TotalItems = totalItems,
                    ItemList = items
                };
                return Ok(result);
            }
            catch
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/targets")]
        public HttpResponseMessage Get(string filterText, string sortBy, SortOrder sortOrder)
        {
            try
            {
                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.TargetSearchSettings;
                var settingsGroup = System.Web.HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder = settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as StringCollection;

                // Filter dataset if required
                var targets = _targetsService.GetAllTargets()
                    .Filter(filterText)
                    .SortBy(sortBy, sortOrder, x => x.Id);

                return GetCsv("Target", columnDisplayOrder, targets);
            }
            catch
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/targets/{targetId}")]
        public IHttpActionResult Get(int targetId)
        {
            var target = _targetsService.GetTarget(targetId);
            if (target == null)
                return NotFound();

            var model = new TargetModel();
            Mapper.Map(target, model);
            model.HasAssociations = _targetsService.HasAssociations(target);
            return Ok(model);
        }

        // POST: api/targets
        [HttpPost]
        [Route("api/targets")]
        [HasPermission(Permission.CreateEditTargets)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Create([FromBody]TargetModel model)
        {
            try
            {
                var target = new Target();
                Mapper.Map(model, target);
                if (!_targetsService.IsTargetExists(target))
                {
                    _targetsService.CreateTarget(target);
                    model.Id = target.Id;
                }
                else
                {
                    model.SetError("Name", "Duplicate target name");
                }

                return Ok(model);
            }
            catch
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/targets/{targetId}")]
        [HasPermission(Permission.CreateEditTargets)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Update([FromUri]int targetId, [FromBody]TargetModel model)
        {
            var target = _targetsService.GetTarget(targetId);
            if (target == null)
                return NotFound();

            Mapper.Map(model, target);
            if (!_targetsService.IsTargetExists(target))
            {
                _targetsService.UpdateTarget(target);
            }
            else
            {
                model.SetError("Name", "Duplicate target name");
            }

            return Ok(model);
        }

        // DELETE: api/targets/5
        [HttpDelete]
        [Route("api/targets/{targetId}")]
        [HasPermission(Permission.CreateEditTargets)]
        public IHttpActionResult Delete(int targetId)
        {
            var target = _targetsService.GetTarget(targetId);
            if (target == null)
                return NotFound();

            _targetsService.DeleteTarget(target);
            return Ok(target);
        }
    }
}
