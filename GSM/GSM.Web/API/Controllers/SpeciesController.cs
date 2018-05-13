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
using GSM.Data.Services.Interfaces;
using GSM.Infrastructure.Filters;
using Permission = GSM.Infrastructure.Filters.Permission;

namespace GSM.API.Controllers
{
    [Authorize]
    public class SpeciesController : BaseController
    {
        private readonly ISpeciesService _speciesService;

        public SpeciesController(ISpeciesService speciesService)
        {
            _speciesService = speciesService;
        }

        [HttpGet]
        [Route("api/species")]
        public IHttpActionResult Get(string filterText, string sortBy, SortOrder sortOrder, int pageNo, int pageSize)
        {
            try
            {
                // Filter sort and order
                // Take care of the pagination
                var filteredSpecies = _speciesService.GetAllSpecies()
                    .Filter(filterText);

                var species = filteredSpecies
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .Skip((pageNo - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var totalItems = filteredSpecies.Count();
                var items = new List<SpeciesViewModel>();
                Mapper.Map(species, items);
                var result = new SearchResult<SpeciesViewModel>
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
        [Route("api/species")]
        public HttpResponseMessage Get(string filterText, string sortBy, SortOrder sortOrder)
        {
            try
            {
                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.SpeciesSearchSettings;
                var settingsGroup = System.Web.HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder = settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as StringCollection;

                // Filter dataset if required
                var species = _speciesService.GetAllSpecies()
                    .Filter(filterText)
                    .SortBy(sortBy, sortOrder, x => x.Id);

                return GetCsv("Species", columnDisplayOrder, species);
            }
            catch
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/species/{speciesId}")]
        public IHttpActionResult Get(int speciesId)
        {
            var species = _speciesService.GetSpecies(speciesId);
            if (species == null)
                return NotFound();

            var model = new SpeciesModel();
            Mapper.Map(species, model);
            model.HasAssociations = _speciesService.HasAssociations(species);
            return Ok(model);
        }

        // POST: api/species
        [HttpPost]
        [Route("api/species")]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        [HasPermission(Permission.CreateEditSpecies)]
        public IHttpActionResult Create([FromBody]SpeciesModel model)
        {
            try
            {
                var species = new Species();
                Mapper.Map(model, species);
                if (!_speciesService.IsSpeciesExists(species))
                {
                    _speciesService.CreateSpecies(species);
                    model.Id = species.Id;
                }
                else
                {
                    model.SetError("Name", "Duplicate species name");
                }

                return Ok(model);
            }
            catch
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/species/{speciesId}")]
        [HasPermission(Permission.CreateEditSpecies)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Update([FromUri]int speciesId, [FromBody]SpeciesModel model)
        {
            var species = _speciesService.GetSpecies(model.Id);
            if (species == null)
                return NotFound();

            Mapper.Map(model, species);
            if (!_speciesService.IsSpeciesExists(species))
            {
                _speciesService.UpdateSpecies(species);
            }
            else
            {
                model.SetError("Name", "Duplicate species name");
            }

            return Ok(model);
        }

        // DELETE: api/species/5
        [HttpDelete]
        [Route("api/species/{speciesId}")]
        [HasPermission(Permission.CreateEditSpecies)]
        public IHttpActionResult Delete(int speciesId)
        {
            var item = _speciesService.GetSpecies(speciesId);
            if (item == null)
                return NotFound();

            _speciesService.DeleteSpecies(item);
            return Ok(item);
        }
    }
}
