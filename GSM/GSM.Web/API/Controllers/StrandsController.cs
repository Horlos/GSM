using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Collections.Specialized;
using System.Data;
using System.Threading.Tasks;
using System.Web;
using AutoMapper;
using DelegateDecompiler;
using Excel;
using GSM.API.Models;
using GSM.API.Models.ModStructures;
using GSM.API.Models.Orientations;
using GSM.API.Models.Strands;
using GSM.Data.Models;
using GSM.Data.Services;
using GSM.Infrastructure.Filters;
using GSM.Utils;
using Permission = GSM.Infrastructure.Filters.Permission;

namespace GSM.API.Controllers
{
    [Authorize]
    public class StrandsController : BaseController
    {
        private readonly StrandsService _strandsService;

        public StrandsController()
        {
            _strandsService = new StrandsService();
        }

        [HttpGet]
        [Route("api/strands")]
        public IHttpActionResult Get(string filterText, string sortBy, SortOrder sortOrder, int pageNo, int pageSize)
        {
            try
            {
                var filteredStrands = _strandsService.GetStrands()
                    .ToList()
                    .AsQueryable()
                    .Filter(filterText);

                // Filter sort and order
                // Take care of the pagination
                var strands = filteredStrands
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .Skip((pageNo - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var totalItems = filteredStrands.Count();
                var items = new List<StrandModel>();
                Mapper.Map(strands, items);

                var result = new SearchResult<StrandModel>
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
        [Route("api/strands")]
        public HttpResponseMessage Get(string filterText, string sortBy, SortOrder sortOrder)
        {
            try
            {
                var strands = _strandsService.GetStrands()
                    .Filter(filterText)
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .ToList();

                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.StrandSearchSettings;
                var settingsGroup =
                    HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder =
                    settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as
                        StringCollection;

                return GetCsv("Strand", columnDisplayOrder, strands);
            }
            catch
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/strands/{strandId}")]
        public IHttpActionResult Get(int strandId)
        {
            var strand = _strandsService.GetStrand(strandId);
            if (strand == null)
                return NotFound();

            var hasAssociations = _strandsService.HasAssociations(strandId);
            var model = new StrandModel { HasAssociations = hasAssociations };
            Mapper.Map(strand, model);
            return Ok(model);
        }

        [HttpGet]
        [Route("api/strands/{targetId}/target")]
        public IHttpActionResult GetStrandsByTargetId(int targetId)
        {
            var result = new
            {
                //TODO replace orientation match with enum
                SenseStrands = _strandsService.GetStrands(targetId, "Sense").ToList(),
                AntisenseStrands = _strandsService.GetStrands(targetId, "Antisense").ToList()
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("api/strandsGrid")]
        [Route("api/strands/{orientation}/{target}")]
        public IHttpActionResult GetStrandsByTargetId(int target, string orientation, string filterText, string sortBy,
            SortOrder sortOrder, int pageNo, int pageSize)
        {
            var filteredStrands = _strandsService.GetStrands(target, orientation)
                .Filter(filterText);

            var strands = filteredStrands
                .SortBy(sortBy, sortOrder, x => x.Id)
                .Skip((pageNo - 1)*pageSize)
                .Take(pageSize)
                .ToList();

            var totalItems = filteredStrands.Count();
            var items = new List<StrandModel>();
            Mapper.Map(strands, items);

            var result = new SearchResult<StrandModel>
            {
                TotalItems = totalItems,
                ItemList = items
            };

            return Ok(result);
        }

        [HttpGet]
        [Route("api/strands/{strandId}/batches")]
        public IHttpActionResult GetStrandBatches([FromUri] int strandId, string filterText, string sortBy,
            SortOrder sortOrder, int pageNo, int pageSize)
        {
            var filteredStrandBatches = _strandsService.GetStrandBatches(strandId)
                .Filter(filterText)
                .Decompile();

            var strandBatches = filteredStrandBatches
                .SortBy(sortBy, sortOrder, x => x.Id)
                .Skip((pageNo - 1) * pageSize)
                .Take(pageSize);

            var totalItems = filteredStrandBatches.Count();
            var items = new List<StrandBatchModel>();
            Mapper.Map(strandBatches, items);

            var model = new SearchResult<StrandBatchModel>
            {
                ItemList = items,
                TotalItems = totalItems
            };

            return Ok(model);
        }

        [HttpGet]
        [Route("api/strands/batches")]
        public IHttpActionResult GetStrandBatches(string filterText, string sortBy,
            SortOrder sortOrder, int pageNo, int pageSize)
        {
            var filteredStrandBatches = _strandsService.GetStrandBatches()
                .Filter(filterText)
                .Decompile();

            var strandBatches = filteredStrandBatches
                .SortBy(sortBy, sortOrder, x => x.Id)
                .Skip((pageNo - 1) * pageSize)
                .Take(pageSize);

            var totalItems = filteredStrandBatches.Count();
            var items = new List<StrandBatchModel>();
            Mapper.Map(strandBatches, items);

            var model = new SearchResult<StrandBatchModel>
            {
                TotalItems = totalItems,
                ItemList = items
            };

            return Ok(model);
        }

        [HttpGet]
        [Route("api/strands/{orientation}/{targetId}/batches")]
        public IHttpActionResult GetStrandBatches(string orientation, int targetId, string filterText, string sortBy,
            SortOrder sortOrder, int pageNo, int pageSize)
        {
            var filteredStrandBatches = _strandsService.GetStrandBatches(targetId, orientation)
                .Filter(filterText)
                .Decompile();

            var strandBatches = filteredStrandBatches
                .SortBy(sortBy, sortOrder, x => x.Id)
                .Skip((pageNo - 1)*pageSize)
                .Take(pageSize);

            var totalItems = filteredStrandBatches.Count();
            var items = new List<StrandBatchModel>();
            Mapper.Map(strandBatches, items);

            var model = new SearchResult<StrandBatchModel>
            {
                TotalItems = totalItems,
                ItemList = items
            };

            return Ok(model);
        }

        [HttpGet]
        [Route("api/strands/batches")]
        public HttpResponseMessage GetStrandBatches(string filterText, string sortBy, SortOrder sortOrder)
        {
            try
            {
                var strandBatches = _strandsService.GetStrandBatches()
                    .Filter(filterText)
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .ToList();

                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.StrandBatchSearchSettings;
                var settingsGroup =
                    HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder =
                    settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as
                        StringCollection;

                return GetCsv("StrandBatch", columnDisplayOrder, strandBatches);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/strands/batches/{strandBatchId}")]
        public IHttpActionResult GetStrandBatch([FromUri] int strandBatchId)
        {
            var strandBatch = _strandsService.GetStrandBatch(strandBatchId);
            if (strandBatch != null)
            {
                var model = new StrandBatchModel();
                Mapper.Map(strandBatch, model);
                return Ok(model);
            }

            return NotFound();
        }

        // POST: api/targets
        [HttpPost]
        [HasPermission(Permission.CreateStrand)]
        [Route("api/strands")]
        public IHttpActionResult Create([FromBody] StrandModel model)
        {
            try
            {
                var strand = new Strand();
                Mapper.Map(model, strand);
                if (!_strandsService.IsStrandExists(strand))
                {
                    _strandsService.CreateStrand(strand);
                    model.Id = strand.Id;
                }
                else
                {
                    model.SetError("Sequence", "Duplicate strand");
                }

                return Ok(model);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/strands/multiple")]
        [HasPermission(Permission.ImportStrand)]
        public IHttpActionResult CreateMultiple([FromBody] ICollection<StrandModel> model)
        {
            try
            {
                foreach (var strandModel in model)
                {
                    var strand = new Strand();
                    Mapper.Map(strandModel, strand);
                    if (!_strandsService.IsStrandExists(strand))
                    {
                        _strandsService.CreateStrand(strand);
                        strandModel.Id = strand.Id;
                    }
                    else
                    {
                        strandModel.SetError("Sequence", "Duplicate strand");
                    }
                }

                return Ok(model);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/strands/{strandId}")]
        [HasPermission(Permission.CreateStrand)]
        public IHttpActionResult Update([FromBody] StrandModel model)
        {
            var strandId = model.Id;
            var strand = _strandsService.GetStrand(strandId);
            if (strand != null)
            {
                Mapper.Map(model, strand, opt => opt.BeforeMap((src, dest) =>
                {
                    dest.Species.Clear();
                    dest.StrandModStructures.Clear();
                }));

                if (!_strandsService.IsStrandExists(strand))
                {
                    _strandsService.UpdateStrand(strand);
                }
                else
                {
                    model.SetError("Name", "Duplicate strand name");
                }
            }

            return Ok(model);
        }

        [HttpPost]
        [Route("api/mergestrand")]
        [HasPermission(Permission.CreateStrand)]
        public IHttpActionResult Merge([FromBody] ICollection<StrandModel> model)
        {
            foreach (var strandModel in model)
            {
                var strandId = strandModel.Id;
                var strand = new Strand(strandModel.StrandId);
                Mapper.Map(strandModel, strand);
                strand.Sequence = strandModel.Sequence;
                strand.Id = 0;
                if (!_strandsService.IsStrandExists(strand))
                {
                    strand.Id = strandId;
                    _strandsService.MergeStrand(strand);
                }
                else
                {
                    strandModel.SetError("Sequence", "Duplicate Sequence");
                }
            }

            return Ok(model);
        }

        [HttpPost]
        [Route("api/strands/import")]
        [HasPermission(Permission.ImportStrand)]
        public async Task<IHttpActionResult> Import()
        {
            var provider = new InMemoryMultipartFormDataStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);

            var model = new List<ImportedStrandViewModel>();
            IEnumerable<StrandSheetModel> strandSheets;

            try
            {
                strandSheets = await ParseFile(provider.Files);
            }
            catch (Exception)
            {
                return BadRequest("Uploaded file has incorrect format");
            }

            foreach (var strandSheet in strandSheets)
            {
                var orientationModel = new OrientationModel { Name = strandSheet.Orientation };
                var orientation = _strandsService.GetOrientationByName(strandSheet.Orientation);
                if (orientation == null)
                    orientationModel.SetError("", "");

                var targetModel = new TargetModel { Name = strandSheet.Target };
                var target = _strandsService.GetTargetByName(strandSheet.Target);
                if (target == null)
                    targetModel.SetError("", "");

                var firstPosition = 1;
                if (strandSheet.Orientation == "Sense")
                    firstPosition = strandSheet.ModStructures.Count;

                Mapper.Map(orientation, orientationModel);
                Mapper.Map(target, targetModel);
                var strandModel = new ImportedStrandViewModel
                {
                    FirstPosition = firstPosition,
                    Sequence = strandSheet.Sequence,
                    ParentSequence = strandSheet.ParentSequence,
                    GenomeNumber = strandSheet.GenomeNumber,
                    GenomePosition = strandSheet.GenomePosition,
                    Orientation = orientationModel,
                    Target = targetModel,
                    StrandModStructures = new List<StrandModStructureModel>()
                };

                var ordinalPosition = 0;
                foreach (var modStructureName in strandSheet.ModStructures)
                {
                    var modStructureModel = new ModStructureModel
                    {
                        Name = modStructureName
                    };
                    var modStructure = _strandsService.GetModStructureByName(modStructureName);
                    if (modStructure == null)
                        modStructureModel.SetError("", "");

                    Mapper.Map(modStructure, modStructureModel);
                    var strandModStructure = new StrandModStructureModel { ModStructure = modStructureModel, OrdinalPosition = ordinalPosition + 1 };
                    strandModel.StrandModStructures.Add(strandModStructure);
                    ordinalPosition++;
                }
                model.Add(strandModel);
            }


            return Ok(model);
        }

        [HttpPost]
        [Route("api/strands/{strandId}/batches")]
        [HasPermission(Permission.CreateStrandBatch)]
        public IHttpActionResult CreateStrandBatch([FromUri] int strandId, [FromBody] StrandBatchModel model)
        {
            if (ModelState.IsValid)
            {
                var strandBatch = new StrandBatch(model.RunId, model.Position);
                Mapper.Map(model, strandBatch);
                if (!_strandsService.IsStrandBatchExist(strandBatch))
                {
                    _strandsService.CreateStrandBatch(strandBatch);
                    model.Id = strandBatch.Id;
                }
                else
                {
                    model.SetError("BatchNumber", "Duplicate strand batch");
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
        [Route("api/strands/{strandId}/batches/combine")]
        [HasPermission(Permission.CreateStrandBatch)]
        public IHttpActionResult CombineStrandBatches([FromUri] int strandId, [FromBody] CombineStrandBatchesViewModel model)
        {
            if (ModelState.IsValid)
            {
                model.StrandBatch.StrandId = strandId;
                var strandBatch = new StrandBatch(model.StrandBatch.RunId, model.StrandBatch.Position);
                Mapper.Map(model.StrandBatch, strandBatch);
                if (!_strandsService.IsStrandBatchExist(strandBatch))
                {
                    var isCombined = _strandsService.CombineBatches(strandBatch, model.CombinedBatches);
                    if (isCombined)
                        model.StrandBatch.Id = strandBatch.Id;
                }
                else
                {
                    model.StrandBatch.SetError("BatchNumber", "Duplicate strand batch");
                }
            }

            return Ok(model.StrandBatch);
        }

        [HttpPost]
        [Route("api/strands/{strandId}/batches/{strandBatchId}/split")]
        [HasPermission(Permission.CreateStrandBatch)]
        public IHttpActionResult SplitStrandBatch([FromUri] int strandId, [FromUri] int strandBatchId,
            [FromBody] ICollection<StrandBatchModel> model)
        {
            if (model == null)
                return BadRequest();

            var sourceBatch = _strandsService.GetStrandBatch(strandId, strandBatchId);
            if (sourceBatch == null)
                return BadRequest();

            var splittedBatches = new List<StrandBatch>();
            foreach (var batchModel in model)
            {
                var strandBatch = new StrandBatch(batchModel.RunId, batchModel.Position);
                Mapper.Map(batchModel, strandBatch);
                if (!_strandsService.IsStrandBatchExist(strandBatch))
                {
                    splittedBatches.Add(strandBatch);
                }
                else
                {
                    batchModel.SetError("BatchNumber", "Duplicate strand batch");
                }
            }

            if (splittedBatches.Count == model.Count)
                _strandsService.SplitStrandBatch(sourceBatch, splittedBatches);

            return Ok(model);
        }

        [HttpPost]
        [Route("api/strands/{strandId}/batches/{strandBatchId}")]
        [HasPermission(Permission.CreateStrandBatch)]
        public IHttpActionResult Update([FromUri]int strandId, [FromUri]int strandBatchId, [FromBody] StrandBatchModel model)
        {
            if (ModelState.IsValid)
            {
                var strandBatch = _strandsService.GetStrandBatch(strandBatchId);
                if (strandBatch != null)
                {
                    Mapper.Map(model, strandBatch);
                    strandBatch.BatchNumber = string.Format("{0}_{1}", strandBatch.RunId, strandBatch.Position);
                    var isDuplicate = _strandsService.IsStrandBatchExist(strandBatch);
                    if (!isDuplicate)
                    {
                        _strandsService.UpdateStrandBatch(strandBatch);
                    }
                    else
                    {
                        model.SetError("BatchNumber", "Duplicate strand batch");
                    }
                }
                else
                {
                    return NotFound();
                }
            }

            return Ok(model);
        }

        // DELETE: api/strands/5
        [HttpDelete]
        [Route("api/strands/{strandId}")]
        [HasPermission(Permission.CreateStrand)]
        public IHttpActionResult Delete(int strandId)
        {
            var strand = _strandsService.GetStrand(strandId);
            if (strand == null)
                return NotFound();

            _strandsService.DeleteStrand(strand);
            return Ok(strand);
        }

        private async Task<IEnumerable<StrandSheetModel>> ParseFile(IEnumerable<HttpContent> fileData)
        {
            var strands = new List<StrandSheetModel>();
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
                                var sequence = row["Sequence"].ToString();
                                var target = row["Target"].ToString();
                                var orientation = row["Orientation"].ToString();
                                var genomeNumber = row["Genome#"].ToString();
                                var genomePosition = row["Genome Position"].ToString();
                                var parentSequence = row["ParentSequence"].ToString();

                                if (string.IsNullOrEmpty(sequence) || string.IsNullOrEmpty(target) ||
                                    string.IsNullOrEmpty(orientation))
                                    continue;

                                var modStructures = ParseSequence(sequence);
                                var strand = new StrandSheetModel
                                {
                                    Sequence = sequence,
                                    ParentSequence = parentSequence,
                                    GenomePosition = genomePosition,
                                    GenomeNumber = genomeNumber,
                                    Target = target,
                                    Orientation = orientation,
                                    ModStructures = modStructures.ToList()
                                };
                                strands.Add(strand);
                            }
                        }
                    }
                }
            }

            return strands;
        }

        private IEnumerable<string> ParseSequence(string sequence)
        {
            var modStructures = sequence.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
            return modStructures;
        }

        //private IEnumerable<string> ParseSequence(string sequence)
        //{
        //    var modStructures = new List<string>();
        //    var structure = new StringBuilder();
        //    var isParenthesisOpened = false;
        //    foreach (var symbol in sequence)
        //    {
        //        if (symbol == '(')
        //            isParenthesisOpened = true;
        //        else if (symbol == ')')
        //            isParenthesisOpened = false;
        //        else
        //            structure.Append(symbol);

        //        if (!isParenthesisOpened)
        //        {
        //            modStructures.Add(structure.ToString().Trim());
        //            structure.Clear();
        //        }
        //    }

        //    return modStructures;
        //}
    }
}
