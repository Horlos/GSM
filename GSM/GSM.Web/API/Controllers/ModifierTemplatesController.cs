using System;
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
using GSM.API.Models.ModifierTemplates;
using GSM.Data.Services.Interfaces;
using GSM.Infrastructure.Filters;

namespace GSM.API.Controllers
{
    [Authorize]
    public class ModifierTemplatesController : BaseController
    {
        private readonly IModifierTemplatesService _modifierTemplatesService;

        public ModifierTemplatesController(IModifierTemplatesService modifierTemplatesService)
        {
            _modifierTemplatesService = modifierTemplatesService;
        }

        [HttpGet]
        [Route("api/modifiertemplates")]
        public IHttpActionResult Get(string filterText, string sortBy, SortOrder sortOrder, int pageNo, int pageSize)
        {
            try
            {
                // Filter sort and order
                // Take care of the pagination
                var filteredModifierTemplates =
                    _modifierTemplatesService.GetAllModifierTemplates()
                        .Filter(filterText);

                var modifierTemplates = filteredModifierTemplates
                        .SortBy(sortBy, sortOrder, x => x.Id)
                        .Skip((pageNo - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();

                var totalItems = filteredModifierTemplates.Count();
                var items = new List<ModifierTemplateViewModel>();
                Mapper.Map(modifierTemplates, items);
                var result = new SearchResult<ModifierTemplateViewModel>
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
        [Route("api/modifiertemplates")]
        public HttpResponseMessage Get(string filterText, string sortBy, SortOrder sortOrder)
        {
            try
            {
                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.ModifierTemplateSearchSettings;
                var settingsGroup = System.Web.HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder = settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as StringCollection;

                // Filter dataset if required
                var modifierTemplates =
                  _modifierTemplatesService.GetAllModifierTemplates()
                      .Filter(filterText)
                      .SortBy(sortBy, sortOrder, x => x.Id);

                return GetCsv("ModifierTemplate", columnDisplayOrder, modifierTemplates);
            }
            catch
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/modifiertemplates/{modifierTemplateId}")]
        public IHttpActionResult Get(int modifierTemplateId)
        {
            var modifierTemplate = _modifierTemplatesService.GetModifierTemplate(modifierTemplateId);
            if (modifierTemplate == null)
                return NotFound();

            var model = new ModifierTemplateModel();
            Mapper.Map(modifierTemplate, model);
            return Ok(model);
        }

        [HttpPost]
        [Route("api/modifiertemplates")]
        [HasPermission(Infrastructure.Filters.Permission.ManageModifierTemplates)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Create([FromBody]ModifierTemplateModel model)
        {
            try
            {
                var modifierTemplate = new ModifierTemplate();
                Mapper.Map(model, modifierTemplate);
                if (!_modifierTemplatesService.IsModifierTemplateExists(modifierTemplate))
                {
                    _modifierTemplatesService.CreateModifierTemplate(modifierTemplate);
                    model.Id = modifierTemplate.Id;
                }
                else
                {
                    model.SetError("Name", "Duplicate Modifier Template name");
                }

                return Ok(model);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/modifiertemplates/{modifierTemplateId}")]
        [HasPermission(Infrastructure.Filters.Permission.ManageModifierTemplates)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Update([FromUri] int modifierTemplateId, [FromBody] ModifierTemplateModel model)
        {
            try
            {
                var modifierTemplate = _modifierTemplatesService.GetModifierTemplate(modifierTemplateId);
                if (modifierTemplate == null)
                    return NotFound();

                Mapper.Map(model, modifierTemplate, opt => opt.BeforeMap((src, dest) =>
                  {
                      dest.ModifierTemplatePositions.Clear();
                  }));

                if (!_modifierTemplatesService.IsModifierTemplateExists(modifierTemplate))
                {
                    _modifierTemplatesService.UpdateModifierTemplate(modifierTemplate);
                }
                else
                {
                    model.SetError("Name", "Duplicate modifier template name");
                }

                return Ok(model);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [HttpDelete]
        [Route("api/modifiertemplates/{modifierTemplateId}")]
        [HasPermission(Infrastructure.Filters.Permission.ManageModifierTemplates)]
        public IHttpActionResult Delete(int modifierTemplateId)
        {
            var modifierTemplate = _modifierTemplatesService.GetModifierTemplate(modifierTemplateId);
            if (modifierTemplate == null)
                return NotFound();

            _modifierTemplatesService.DeleteModifierTemplate(modifierTemplate);
            return Ok(modifierTemplate);
        }
    }
}
