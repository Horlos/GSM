using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;
using GSM.Utils;
using System.Collections.Specialized;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.ValueProviders;
using AutoMapper;
using DelegateDecompiler;
using Excel;
using GSM.API.Models;
using GSM.API.Models.Duplex;
using GSM.Data.Models;
using GSM.Data.Services;
using GSM.Infrastructure.Filters;
using Duplex = GSM.Data.Models.Duplex;
using Permission = GSM.Infrastructure.Filters.Permission;

namespace GSM.API.Controllers
{
    [Authorize]
    public class DuplexesController : BaseController
    {
        private readonly DuplexesService _duplexesService;

        public DuplexesController()
        {
            _duplexesService = new DuplexesService();
        }

        [HttpGet]
        [Route("api/duplexes")]
        public IHttpActionResult Get(string filterText, string sortBy, SortOrder sortOrder, int pageNo, int pageSize)
        {
            try
            {
                // Filter sort and order
                // Take care of the pagination
                var filteredDuplexes = _duplexesService.GetDuplexes()
                    .Filter(filterText);

                var duplexes = filteredDuplexes
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .Skip((pageNo - 1)*pageSize)
                    .Take(pageSize)
                    .ToList();

                var totalItems = filteredDuplexes.Count();
                var items = new List<DuplexViewModel>();
                Mapper.Map(duplexes, items);
                var result = new SearchResult<DuplexViewModel>
                {
                    TotalItems = totalItems,
                    ItemList = items
                };
                return Ok(result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/duplexes")]
        public HttpResponseMessage Get(string filterText, string sortBy, SortOrder sortOrder)
        {
            try
            {
                var duplexes = _duplexesService.GetDuplexes()
                    .Filter(filterText)
                    .SortBy(sortBy, sortOrder, x => x.Id);

                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.DuplexSearchSettings;
                var settingsGroup = HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder = settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as StringCollection;

                return GetCsv("Duplex", columnDisplayOrder, duplexes);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/duplexes/{duplexId}")]
        public IHttpActionResult Get(int duplexId)
        {
            var duplex = _duplexesService.GetDuplex(duplexId);
            if (duplex == null)
                return NotFound();

            var model = new DuplexModel();
            Mapper.Map(duplex, model);
            return Ok(model);
        }

        [HttpPost]
        [Route("api/duplexes/validate")]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Validate([FromBody]DuplexModel model)
        {
            try
            {
                var duplex = new Duplex(model.DuplexId);
                Mapper.Map(model, duplex);
                if (_duplexesService.IsDuplexExists(duplex))
                {
                    model.SetError("Duplex", "A duplex with this configuration already exists.");
                }

                return Ok(model);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/duplexes")]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        [HasPermission(Permission.CreateDuplex)]
        public IHttpActionResult Create([FromBody]DuplexModel model)
        {
            try
            {
                var duplex = new Duplex();
                Mapper.Map(model, duplex);
                if (!_duplexesService.IsDuplexExists(duplex))
                {
                    _duplexesService.CreateDuplex(duplex);
                }
                else
                {
                    model.SetError("Duplex", "A duplex with this configuration already exists.");
                }

                return Ok(model);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/duplexes/multiple")]
        [HasPermission(Permission.CreateDuplex, Permission.ImportDuplexes)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult CreateMultiple([FromBody] ICollection<DuplexModel> models)
        {
            var duplexes = new List<Duplex>();
            foreach (var duplexModel in models)
            {
                var duplex = new Duplex();
                Mapper.Map(duplexModel, duplex);
                if (!_duplexesService.IsDuplexExists(duplex))
                {
                    _duplexesService.CreateDuplex(duplex);
                    duplexModel.Id = duplex.Id;
                }
                else
                {
                    duplexModel.SetError("Duplex", "A duplex with this configuration already exists.");
                }
            }

            return Ok(models);
        }

        [HttpPost]
        [Route("api/duplexes/{duplexId}")]
        [HasPermission(Permission.CreateDuplex)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Update([FromUri]int duplexId, [FromBody]DuplexModel model)
        {
            var duplex = _duplexesService.GetDuplex(duplexId);
            if (duplex != null)
            {
                _duplexesService.UpdateDuplex(duplex);
            }

            return Ok(model);
        }

        [HttpPost]
        [Route("api/duplexes/import")]
        [HasPermission(Permission.ImportDuplexes)]
        public async Task<IHttpActionResult> ImportDuplexes()
        {
            var provider = new InMemoryMultipartFormDataStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            IEnumerable<DuplexSheetModel> duplexSheets;

            try
            {
                duplexSheets = await ParseFile(provider.Files);
            }
            catch(Exception)
            {
                return BadRequest("Uploaded file has incorrect format");
            }

            var model = new List<ImportedDuplexModel>();
            foreach (var duplexSheet in duplexSheets)
            {
                var antiSenseStrandModel = new StrandModel { StrandId = duplexSheet.AntiSenseStrandId };
                var antiSenseStrand = _duplexesService.GetStrand(duplexSheet.AntiSenseStrandId);
                if (antiSenseStrand == null)
                {
                    antiSenseStrandModel.SetError("", "");
                }

                var senseStrandModel = new StrandModel { StrandId = duplexSheet.SenseStrandId };
                var senseStrand = _duplexesService.GetStrand(duplexSheet.SenseStrandId);
                if (senseStrand == null)
                {
                    senseStrandModel.SetError("", "");
                }

                Mapper.Map(antiSenseStrand, antiSenseStrandModel);
                Mapper.Map(senseStrand, senseStrandModel);

                var targetModel = new TargetModel();
                Mapper.Map(senseStrandModel.Target, targetModel);

                if (antiSenseStrandModel.Target == null || senseStrandModel.Target == null ||
                    antiSenseStrandModel.Target.Id != senseStrandModel.Target.Id)
                    targetModel.SetError("", "");

                var duplexModel = new ImportedDuplexModel
                {
                    Target = targetModel,
                    AntiSenseStrand = antiSenseStrandModel,
                    SenseStrand = senseStrandModel,
                    MW = senseStrandModel.MW + antiSenseStrandModel.MW
                };
                model.Add(duplexModel);
            }

            return Ok(model);
        }

        // DELETE: api/duplexes/5
        [HttpDelete]
        [Route("api/duplexes/{duplexId}")]
        [HasPermission(Permission.CreateDuplex)]
        public IHttpActionResult Delete(int duplexId)
        {
            var duplex = _duplexesService.GetDuplex(duplexId);
            if (duplex == null)
                return NotFound();

            _duplexesService.DeleteDuplex(duplex);
            return Ok(duplex);
        }

        [HttpGet]
        [Route("api/duplexes/batches")]
        public IHttpActionResult GetDuplexBatches(string filterText, string sortBy, SortOrder sortOrder, int pageNo, int pageSize)
        {
            try
            {
                // Filter sort and order
                // Take care of the pagination
                var filteredDuplexBatches = _duplexesService.GetDuplexBatches()
                    .Filter(filterText)
                    .Decompile();

                var duplexBatches = filteredDuplexBatches
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .Skip((pageNo - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var totalItems = filteredDuplexBatches.Count();
                var items = new List<DuplexBatchViewModel>();
                Mapper.Map(duplexBatches, items);
                var result = new SearchResult<DuplexBatchViewModel>
                {
                    TotalItems = totalItems,
                    ItemList = items
                };
                return Ok(result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/duplexes/batches/denormalized")]
        public IHttpActionResult GetDenormalizedDuplexBatches(string filterText, string sortBy, SortOrder sortOrder, int pageNo, int pageSize)
        {
            try
            {
                // Filter sort and order
                // Take care of the pagination
                var filteredDuplexBatches = _duplexesService.GetDenormalizedDuplexBatches()
                    .Filter(filterText)
                    .Decompile();

                var duplexBatches = filteredDuplexBatches
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .Skip((pageNo - 1)*pageSize)
                    .Take(pageSize)
                    .ToList();

                var totalItems = filteredDuplexBatches.Count();
                var items = new List<DuplexBatchDenormalizedViewModel>();
                Mapper.Map(duplexBatches, items);
                var result = new SearchResult<DuplexBatchDenormalizedViewModel>
                {
                    TotalItems = totalItems,
                    ItemList = items
                };
                return Ok(result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/duplexes/batches")]
        public HttpResponseMessage GetDuplexBatches(string filterText, string sortBy, SortOrder sortOrder)
        {
            try
            {
                var duplexes = _duplexesService.GetDenormalizedDuplexBatches()
                    .Filter(filterText)
                    .SortBy(sortBy, sortOrder, x => x.Id);

                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.DuplexBatchSearchSettings;
                var settingsGroup = HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder = settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as StringCollection;

                // TODO: Bad, bad, bad.
                if (columnDisplayOrder != null)
                {
                    var columns = columnDisplayOrder.Cast<string>().ToList();
                    var denormalizedColumns = new[]
                    {
                        "AntisenseStrandBatch.BatchNumber", "AntisenseStrandBatch.Purity",
                        "AntisenseStrandBatch.Concentration", "AntisenseStrandBatch.RemainingVolume",
                        "SenseStrandBatch.BatchNumber", "SenseStrandBatch.Purity",
                        "SenseStrandBatch.Concentration", "SenseStrandBatch.RemainingVolume"
                    };
                    if (!columns.Any(c => denormalizedColumns.Contains(c)))
                    {
                        duplexes = duplexes.GroupBy(x => x.Id)
                            .Select(x => x.FirstOrDefault());
                    }
                }

                return GetCsv("Duplex Batches", columnDisplayOrder, duplexes.ToList());
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/duplexes/batches/{duplexBatchId}")]
        public IHttpActionResult GetDuplexBatch([FromUri] int duplexBatchId)
        {
            var duplexBatch = _duplexesService.GetDuplexBatch(duplexBatchId);
            var model = new DuplexBatchModel();
            Mapper.Map(duplexBatch, model);
            return Ok(model);
        }

        [HttpPost]
        [Route("api/duplexes/{duplexId}/batches")]
        [HasPermission(Permission.CreateDuplexBatch)]
        public IHttpActionResult CreateDuplexBatch([FromUri] int duplexId, [FromBody]DuplexBatchModel model)
        {
            if (ModelState.IsValid)
            {
                var duplexBatch = new DuplexBatch(model.RunId, model.Position);
                Mapper.Map(model, duplexBatch);
                if (!_duplexesService.IsDuplexBatchExists(duplexBatch))
                {
                    _duplexesService.CreateDuplexBatch(duplexBatch);
                    model.Id = duplexBatch.Id;
                }
                else
                {
                    model.SetError("DuplexBatchNumber", "Duplicate strand batch");
                }
            }
            else
            {
                foreach (var message in ModelState)
                {
                    model.SetError(message.Key, message.ToString());
                }
            }
            return Ok(model);
        }

        [HttpPost]
        [Route("api/duplexes/{duplexId}/batches/{duplexBatchId}")]
        [HasPermission(Permission.CreateDuplexBatch)]
        public IHttpActionResult Update([FromUri] int duplexId, [FromUri] int duplexBatchId, [FromBody]DuplexBatchModel model)
        {
            if (ModelState.IsValid)
            {
                var duplexBatch = _duplexesService.GetDuplexBatch(duplexBatchId);
                if (duplexBatch != null)
                {
                    duplexBatch.DuplexBatchStrandBatches.Clear();
                    Mapper.Map(model, duplexBatch);
                    duplexBatch.DuplexBatchNumber = string.Format("{0}_{1}", duplexBatch.RunId, duplexBatch.Position);
                    if (!_duplexesService.IsDuplexBatchExists(duplexBatch))
                    {
                        _duplexesService.UpdateDuplexBatch(duplexBatch);
                        model.Id = duplexBatch.Id;
                    }
                    else
                    {
                        model.SetError("DuplexBatchNumber", "Duplicate strand batch");
                    }
                }
            }
            else
            {
                foreach (var message in ModelState)
                {
                    model.SetError(message.Key, message.ToString());
                }
            }
            return Ok(model);
        }

        private async Task<IEnumerable<DuplexSheetModel>> ParseFile(IEnumerable<HttpContent> fileData)
        {
            var model = new List<DuplexSheetModel>();
            foreach (HttpContent file in fileData)
            {
                using (var stream = await file.ReadAsStreamAsync())
                {
                    using (IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream))
                    {
                        excelReader.IsFirstRowAsColumnNames = true;
                        var result = excelReader.AsDataSet();
                        foreach (DataTable table in result.Tables)
                        {
                            foreach (DataRow row in table.Rows)
                            {
                                var antisenseStrandId = row["Antisense Strand ID"].ToString();
                                var senseStrandId = row["Sense Strand ID"].ToString();
                                var duplexSheetModel = new DuplexSheetModel
                                {
                                    AntiSenseStrandId = antisenseStrandId,
                                    SenseStrandId = senseStrandId
                                };
                                model.Add(duplexSheetModel);
                            }
                        }
                    }
                }
            }
            return model;
        }
    }
}
