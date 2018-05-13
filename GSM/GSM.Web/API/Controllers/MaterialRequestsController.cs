using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity.Validation;
using System.Web.Http.ValueProviders;
using AutoMapper;
using GSM.Data.Models;
using GSM.Utils;
using GSM.API.Models;
using GSM.API.Models.MaterialRequest;
using GSM.Data.Services.Interfaces;
using GSM.Infrastructure.Filters;
using Permission = GSM.Infrastructure.Filters.Permission;

namespace GSM.API.Controllers
{
    [Authorize]
    public class MaterialRequestsController : BaseController
    {
        private readonly IMaterialRequestsService _materialRequestsService;

        public MaterialRequestsController(IMaterialRequestsService materialRequestsService)
        {
            _materialRequestsService = materialRequestsService;
        }

        [HttpGet]
        [Route("api/materialrequests")]
        public IHttpActionResult Get([FromUri] ListOptions listOptions)
        {
            try
            {
                var sortOrder = listOptions.sortOrder ?? SortOrder.none;
                var pageNumber = listOptions.pageNo ?? 0;
                var pageSize = listOptions.pageSize ?? 10;

                var filteredMaterialRequests =
                    _materialRequestsService.GetAll()
                        .Filter(listOptions.filterText);

                var materialRequests = filteredMaterialRequests
                        .SortBy(listOptions.sortBy, sortOrder, x => x.Id)
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();

                var totalItems = filteredMaterialRequests.Count();
                var items = new List<MaterialRequestViewModel>();
                Mapper.Map(materialRequests, items);
                var result = new SearchResult<MaterialRequestViewModel>
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

        // GET: api/MaterialRequests
        [HttpGet]
        [Route("api/materialrequests/denormalized")]
        public IHttpActionResult GetDenormalized([FromUri] ListOptions listOptions)
        {
            try
            {
                var sortOrder = listOptions.sortOrder ?? SortOrder.none;
                var pageNumber = listOptions.pageNo ?? 0;
                var pageSize = listOptions.pageSize ?? 10;

                var filteredMaterialRequests =
                    _materialRequestsService.GetDenormalizedMaterialRequests()
                        .Filter(listOptions.filterText);

                var materialRequests = filteredMaterialRequests
                        .SortBy(listOptions.sortBy, sortOrder, x => x.Id)
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();

                var totalItems = filteredMaterialRequests.Count();
                var items = new List<MaterialRequestDenormalizedViewModel>();
                Mapper.Map(materialRequests, items);
                var result = new SearchResult<MaterialRequestDenormalizedViewModel>
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
        [Route("api/materialrequestsbystatus")]
        public IHttpActionResult GetByStatus()
        {
            try
            {
                var listStatusRequest = _materialRequestsService.GetAll()
                    .GroupBy(g => g.StatusId)
                    .ToList()
                    .Select(
                        g =>
                            new
                            {
                                StatusId = g.Key,
                                ItemList = Mapper.Map<IEnumerable<MaterialRequestModel>>(g.ToList())
                            }
                    );

                return Ok(listStatusRequest);
            }
            catch (Exception)
            {
                //TODO: how to personalize the error message
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/materialRequestCsv")]
        public HttpResponseMessage GetFile([FromUri] ListOptions listOptions)
        {
            try
            {
                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.MaterialRequestSearchSettings;
                var settingsGroup =
                    System.Web.HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder =
                    settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as
                        StringCollection;

                var sortOrder = listOptions.sortOrder ?? SortOrder.none;
                var materialRequests =
                    _materialRequestsService.GetDenormalizedMaterialRequests()
                        .Filter(listOptions.filterText)
                        .SortBy(listOptions.sortBy, sortOrder, x => x.Id);
                return GetCsv("MaterialRequest", columnDisplayOrder, materialRequests);
            }
            catch
            {
                return null;
            }
        }

        // GET: api/MaterialRequests/5
        [HttpGet]
        [Route("api/materialrequests/{id}")]
        public IHttpActionResult Get([FromUri] int id)
        {
            var materialRequest = _materialRequestsService.GetMaterialRequest(id);
            if (materialRequest == null)
                return NotFound();

            var model = new MaterialRequestModel();
            Mapper.Map(materialRequest, model);
            return Ok(model);
        }

        // POST: api/MaterialRequests
        [HttpPost]
        [Route("api/materialrequests")]
        [HasPermission(Permission.CreateMaterialRequest)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Create([FromBody] MaterialRequestModel model)
        {
            try
            {
                var materialRequest = new MaterialRequest();
                Mapper.Map(model, materialRequest);
                var user = GetCurrentUser();
                materialRequest.SubmittedBy = user.Id;
                _materialRequestsService.Create(materialRequest);
                model.Id = materialRequest.Id;
                model.StatusId = model.StatusId;
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

        // PUT: api/MaterialRequests/5
        [HttpPut]
        [Route("api/materialrequests/{id}")]
        [HasPermission(Permission.CreateMaterialRequest, Permission.UpdateMaterialRequestStatus)]
        public IHttpActionResult Update([FromUri] int id, [FromBody] MaterialRequestModel model)
        {
            try
            {
                var materialRequest = _materialRequestsService.GetMaterialRequest(id);
                if (materialRequest == null)
                    return NotFound();

                //update the MaterialRequests DAO items with the MaterialRequests DTO items
                materialRequest.RequestedStrands.Clear();
                materialRequest.RequestedDuplexes.Clear();
                Mapper.Map(model, materialRequest);
                if (_materialRequestsService.IsStatusExists(model.Status.Id))
                    materialRequest.StatusId = model.Status.Id;

                _materialRequestsService.Update(materialRequest);
                model.Id = materialRequest.Id;
                model.StatusId = materialRequest.StatusId;
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

        // DELETE: api/MaterialRequests/5
        [HttpDelete]
        [Route("api/materialrequests/{id}")]
        [HasPermission(Permission.CreateMaterialRequest)]
        public IHttpActionResult Delete([FromUri] int id)
        {
            var materialRequest = _materialRequestsService.GetMaterialRequest(id);
            if (materialRequest == null)
                return NotFound();

            _materialRequestsService.Delete(materialRequest);
            return Ok(materialRequest);
        }
    }
}
