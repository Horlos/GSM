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
using GSM.API.Models.Instruments;
using GSM.Data.Services.Interfaces;
using GSM.Infrastructure.Filters;
using Permission = GSM.Infrastructure.Filters.Permission;

namespace GSM.API.Controllers
{
    [Authorize]
    public class InstrumentsController : BaseController
    {
        private readonly IInstrumentsService _instrumentsService;

        public InstrumentsController(IInstrumentsService service)
        {
            _instrumentsService = service;
        }

        [HttpGet]
        [Route("api/Instruments")]
        public IHttpActionResult Get(string filterText, string sortBy, SortOrder sortOrder, int pageNo, int pageSize)
        {
            try
            {
                var filteredInstruments = _instrumentsService.GetAllInstruments()
                    .Filter(filterText);

                var instruments = filteredInstruments
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .Skip((pageNo-1)*pageSize)
                    .Take(pageSize)
                    .ToList();

                var totalItems = filteredInstruments.Count();
                var items = new List<InstrumentViewModel>();
                Mapper.Map(instruments, items);
                var result = new SearchResult<InstrumentViewModel>
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
        [Route("api/Instruments")]
        public HttpResponseMessage Get(string filterText, string sortBy, SortOrder sortOrder)
        {
            try
            {
                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.InstrumentSearchSettings;
                var settingsGroup =
                    System.Web.HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder =
                    settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as
                        StringCollection;

                // Filter dataset if required
                var instruments = _instrumentsService.GetAllInstruments()
                    .Filter(filterText)
                    .SortBy(sortBy, sortOrder, x => x.Id);

                return GetCsv("Instrument", columnDisplayOrder, instruments);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/Instruments/{instrumentId}")]
        public IHttpActionResult Get(int instrumentId)
        {
            var item = _instrumentsService.GetInstrument(instrumentId);
            if (item == null)
                return NotFound();

            var model = new InstrumentModel();
            Mapper.Map(item, model);
            return Ok(model);
        }

        // POST: api/Instruments
        [HttpPost]
        [Route("api/Instruments")]
        [HasPermission(Permission.CreateEditInstruments)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Create([FromBody] InstrumentModel newItem)
        {
            try
            {
                var item = new Instrument();
                Mapper.Map(newItem, item);
                if (!_instrumentsService.IsInstrumentExists(item))
                {
                    _instrumentsService.CreateInstrument(item);
                    newItem.Id = item.Id;
                }
                else
                {
                    newItem.SetError("Name", "Duplicate Instrument name");
                }

                return Ok(newItem);
            }
            catch
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/Instruments/{InstrumentId}")]
        [HasPermission(Permission.CreateEditInstruments)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Update([FromBody] InstrumentModel updateItem)
        {
            var item = _instrumentsService.GetInstrument(updateItem.Id);
            if (item == null)
                return NotFound();

            Mapper.Map(updateItem, item);
            if (!_instrumentsService.IsInstrumentExists(item))
            {
                _instrumentsService.UpdateInstrument(item);
            }
            else
            {
                updateItem.SetError("Name", "Duplicate Instrument name");
            }

            return Ok(updateItem);
        }

        // DELETE: api/Instruments/5
        [HttpDelete]
        [HasPermission(Permission.CreateEditInstruments)]
        [Route("api/Instruments/{instrumentId}")]
        public IHttpActionResult Delete(int instrumentId)
        {
            var item = _instrumentsService.GetInstrument(instrumentId);
            if (item == null)
                return NotFound();

            _instrumentsService.DeleteInstrument(item);
            return Ok(item);
        }
    }
}
