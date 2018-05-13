using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity.Validation;
using AutoMapper;
using GSM.Data.Models;
using GSM.Utils;
using GSM.API.Models;
using GSM.API.Models.SynthesisRequest;
using GSM.Data.Services.Interfaces;
using GSM.Infrastructure.Filters;
using Permission = GSM.Infrastructure.Filters.Permission;

namespace GSM.API.Controllers
{
    [Authorize]
    public class SynthesisRequestsController : BaseController
    {
        private readonly ISynthesisRequestsService _synthesisRequestsService;

        public SynthesisRequestsController(ISynthesisRequestsService synthesisRequestsService)
        {
            _synthesisRequestsService = synthesisRequestsService;
        }

        // GET: api/SynthesisRequests
        [HttpGet]
        [Route("api/synthesisrequests")]
        public IHttpActionResult Get([FromUri] ListOptions listOptions)
        {
            try
            {
                var sortOrder = listOptions.sortOrder ?? SortOrder.none;
                var pageNumber = listOptions.pageNo ?? 0;
                var pageSize = listOptions.pageSize ?? 10;

                var filteredSynthesisRequests =
                    _synthesisRequestsService.GetAll()
                        .Filter(listOptions.filterText);

                var synthesisRequests = filteredSynthesisRequests
                        .SortBy(listOptions.sortBy, sortOrder, x => x.Id)
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();

                var totalItems = filteredSynthesisRequests.Count();
                var items = new List<SynthesisRequestViewModel>();
                Mapper.Map(synthesisRequests, items);
                var result = new SearchResult<SynthesisRequestViewModel>
                {
                    TotalItems = totalItems,
                    ItemList = items
                };
                return Ok(result);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        // GET: api/SynthesisRequests
        [HttpGet]
        [Route("api/synthesisrequests/denormalized")]
        public IHttpActionResult GetDenormalized([FromUri] ListOptions listOptions)
        {
            try
            {
                var sortOrder = listOptions.sortOrder ?? SortOrder.none;
                var pageNumber = listOptions.pageNo ?? 0;
                var pageSize = listOptions.pageSize ?? 10;
                var filterText = listOptions.filterText;
                var sortBy = listOptions.sortBy;

                var filteredSynthesisRequests =
                    _synthesisRequestsService.GetDenormalizedSynthesisRequests()
                        .Filter(filterText);

                var synthesisRequests = filteredSynthesisRequests
                        .SortBy(sortBy, sortOrder, x => x.Id)
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();

                var totalItems = filteredSynthesisRequests.Count();
                var items = new List<SynthesisRequestDenormalizedViewModel>();
                Mapper.Map(synthesisRequests, items);
                var result = new SearchResult<SynthesisRequestDenormalizedViewModel>
                {
                    TotalItems = totalItems,
                    ItemList = items
                };
                return Ok(result);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/synthesisrequestsbystatus")]
        public IHttpActionResult GetByStatus()
        {
            try
            {
                var listStatusRequest = _synthesisRequestsService.GetAll()
                    .GroupBy(g => g.StatusId)
                    .ToList();

                var result = listStatusRequest.Select(g => new
                    {
                        StatusId = g.Key,
                        ItemList = Mapper.Map<IEnumerable<SynthesisRequestModel>>(g.ToList())
                    })
                    .ToList();

                return Ok(result);
            }
            catch (Exception)
            {
                //TODO: how to personalize the error message
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/synthesisrequestsCsv")]
        public HttpResponseMessage GetFile([FromUri] ListOptions listOptions)
        {
            try
            {
                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.SynthesisRequestSearchSettings;
                var settingsGroup = System.Web.HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder = settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as StringCollection;

                var filterText = listOptions.filterText;
                var sortBy = listOptions.sortBy;

                var sortOrder = listOptions.sortOrder ?? SortOrder.none;
                var synthesisRequests =
                    _synthesisRequestsService.GetDenormalizedSynthesisRequests()
                        .Filter(filterText)
                        .SortBy(sortBy, sortOrder, x => x.Id);

                // TODO: Bad, bad, bad.
                if (columnDisplayOrder != null)
                {
                    var columns = columnDisplayOrder.Cast<string>().ToList();
                    var denormalizedColumns = new[]
                    {
                       "StrandSynthesisRequest.StrandId", "StrandSynthesisRequest.Scale"
                    };
                    if (!columns.Any(c => denormalizedColumns.Contains(c)))
                    {
                        synthesisRequests = synthesisRequests.GroupBy(x => x.Id).Select(x => x.FirstOrDefault());
                    }
                }

                return GetCsv("SynthesisRequest", columnDisplayOrder, synthesisRequests);
            }
            catch
            {
                return null;
            }
        }

        // GET: api/SynthesisRequests/5
        [HttpGet]
        [Route("api/synthesisrequests/{id}")]
        public IHttpActionResult Get(int id)
        {
            var synthesisRequest = _synthesisRequestsService.GetSynthesisRequest(id);
            if (synthesisRequest == null)
                return NotFound();

            var model = new SynthesisRequestModel();
            Mapper.Map(synthesisRequest, model);
            return Ok(model);
        }

        // POST: api/SynthesisRequests
        [HttpPost]
        [Route("api/synthesisrequests")]
        [HasPermission(Permission.CreateSynthesisRequest)]
        public IHttpActionResult Create([FromBody]SynthesisRequestModel model)
        {
            try
            {
                var synthesisRequest = new SynthesisRequest();
                Mapper.Map(model, synthesisRequest);
                _synthesisRequestsService.CreateSynthesisRequest(synthesisRequest);
                model.Id = synthesisRequest.Id;
                model.StatusId = synthesisRequest.StatusId;
                return Ok(model);
            }
            catch (DbEntityValidationException ex)
            {
                foreach (var entityValidationErrors in ex.EntityValidationErrors)
                {
                    foreach (var validationError in entityValidationErrors.ValidationErrors)
                    {
                        model.SetError(validationError.PropertyName, validationError.ErrorMessage);
                    }
                }
                return Ok(model);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        // PUT: api/SynthesisRequests/5
        [HttpPut]
        [Route("api/synthesisrequests/{id}")]
        [HasPermission(Permission.CreateSynthesisRequest, Permission.UpdateSynthesisRequestStatus)]
        public IHttpActionResult Update([FromUri]int id, [FromBody]SynthesisRequestModel model)
        {
            try
            {
                var synthesisRequest = _synthesisRequestsService.GetSynthesisRequest(id);
                if (synthesisRequest == null)
                    return NotFound();

                synthesisRequest.SynthesisRequestStrands.Clear();
                synthesisRequest.MaterialRequests.Clear();
                Mapper.Map(model, synthesisRequest);
                if (_synthesisRequestsService.IsStatusExists(model.StatusId))
                    synthesisRequest.StatusId = model.StatusId;

                _synthesisRequestsService.UpdateSynthesisRequest(synthesisRequest);
                return Ok(model);
            }
            catch (DbEntityValidationException ex)
            {
                foreach (var entityValidationErrors in ex.EntityValidationErrors)
                {
                    foreach (var validationError in entityValidationErrors.ValidationErrors)
                    {
                        model.SetError(validationError.PropertyName, validationError.ErrorMessage);
                    }
                }
                return Ok(model);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        // DELETE: api/SynthesisRequests/5
        [HttpDelete]
        [Route("api/synthesisrequests/{id}")]
        [HasPermission(Permission.CreateSynthesisRequest, Permission.UpdateSynthesisRequestStatus)]
        public IHttpActionResult Delete([FromUri] int id)
        {
            var synthesisRequest = _synthesisRequestsService.GetSynthesisRequest(id);
            if (synthesisRequest == null)
                return NotFound();

            _synthesisRequestsService.DeleteSynthesisRequest(synthesisRequest);
            return Ok();
        }
    }
}
