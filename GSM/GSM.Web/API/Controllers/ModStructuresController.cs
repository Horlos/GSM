using System.Dynamic;
using System.IO;
using System.Web;
using GSM.API.Models;
using GSM.Data.Models;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ValueProviders;
using AutoMapper;
using GSM.API.Models.ModStructures;
using GSM.Data.Services.Interfaces;
using GSM.Infrastructure.Filters;
using GSM.Utils;
using WebGrease.Css.Extensions;

namespace GSM.API.Controllers
{
    [Authorize]
    public class ModStructuresController : BaseController
    {
        private readonly IModStructuresService _structuresService;

        public ModStructuresController(IModStructuresService structuresService)
        {
            _structuresService = structuresService;
        }


        [HttpGet]
        [Route("api/modstructures")]
        public IHttpActionResult Get(string filterText, string sortBy, SortOrder sortOrder, int pageNo, int pageSize)
        {
            try
            {
                // Filter sort and order
                var filteredModStructures = _structuresService.GetAllModStructures()
                    .Filter(filterText);

                var modStructures = filteredModStructures
                    .SortBy(sortBy, sortOrder, x => x.Id)
                    .Skip((pageNo - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var totalItems = filteredModStructures.Count();
                var items = new List<ModStructureViewModel>();
                Mapper.Map(modStructures, items);
                var result = new SearchResult<ModStructureViewModel>
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
        [Route("api/modstructures")]
        public HttpResponseMessage Get(string filterText, string sortBy, SortOrder sortOrder)
        {
            try
            {
                // WNM - Retrieve the calling user settings so we can know what columns to return ( based on their current view settings )
                var userSearchSettings = UserSettingsHelper.ModStructureSearchSettings;
                var settingsGroup =
                    HttpContext.Current.Profile.GetProfileGroup(userSearchSettings.SearchSettingsGroupName);
                var columnDisplayOrder =
                    settingsGroup.GetPropertyValue(userSearchSettings.ColumnDisplayOrderPropertyName) as
                        StringCollection;

                // Filter dataset if required
                var modStructures = _structuresService.GetAllModStructures()
                    .Filter(filterText)
                    .SortBy(sortBy, sortOrder, x => x.Id);

                return GetCsv("ModStructure", columnDisplayOrder, modStructures);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/modstructures/{modStructureId}")]
        public IHttpActionResult Get(int modStructureId)
        {
            var modStructure = _structuresService.GetModStructure(modStructureId);
            if (modStructure == null)
                return NotFound();

            var model = new ModStructureModel();
            Mapper.Map(modStructure, model);
            model.HasAssociations = _structuresService.HasAssociations(modStructure);
            return Ok(model);
        }

        [HttpGet]
        [Route("api/modstructures/{modStructureName}/validate")]
        public IHttpActionResult IsModStructureValid([FromUri] string modStructureName)
        {
            var modStructure = new ModStructure { Name = modStructureName };
            var isValid = _structuresService.IsModStructureExists(modStructure);
            return Ok(isValid);
        }

        [HttpGet]
        [Route("api/modstructures/bases/{baseStr}")]
        public IHttpActionResult GetByBase(string baseStr)
        {
            var result = new List<ExpandoObject>();
            baseStr.ToCharArray().ForEach(baseChar =>
            {
                result.Add(GetModStructuresByBase(result.Count + 1, baseChar.ToString()));
            });

            return Ok(result);
        }

        [HttpGet]
        [Route("api/modstructures/attachment/{attachmentId}")]
        public HttpResponseMessage GetAttachmentFile(int attachmentId)
        {
            var item = _structuresService.GetAttachement(attachmentId);
            if (item == null)
                return new HttpResponseMessage(HttpStatusCode.NotFound);

            return GetFile(item.FileName, _structuresService.GetAttachmentBytes(attachmentId));
        }

        // POST: api/modstructures
        [HttpPost]
        [Route("api/modstructures")]
        [HasPermission(Infrastructure.Filters.Permission.ManageModStructure)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Create([FromBody] ModStructureModel model)
        {
            try
            {
                var modStructure = new ModStructure();
                Mapper.Map(model, modStructure);
                if (!_structuresService.IsModStructureExists(modStructure))
                {
                    _structuresService.CreateModStructure(modStructure);
                    model.Id = modStructure.Id;
                }
                else
                {
                    model.SetError("Name", string.Format("Mod Structure {0} is already in use.", model.Name));
                }
                return Ok(model);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/modstructures/{modStructureId}")]
        [HasPermission(Infrastructure.Filters.Permission.ManageModStructure)]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Update([FromUri]int modStructureId, [FromBody] ModStructureModel model)
        {
            try
            {
                var modStructure = _structuresService.GetModStructure(modStructureId);
                if (modStructure == null)
                    return NotFound();

                Mapper.Map(model, modStructure, opt => opt.BeforeMap((src, dest) =>
                {
                    dest.InstrumentModStructures.Clear();
                }));

                if (!_structuresService.IsModStructureExists(modStructure))
                {
                    _structuresService.UpdateModStructure(modStructure);
                    var itemAttachments = model.Attachments.Where(info => info.Id != 0).Select(info => info.Id).ToList();
                    _structuresService.UpdateAssociations(modStructureId, itemAttachments);
                    //var instrumentModStructures = model.InstrumentModStructures;
                    //_structuresService.UpdateInstrumentModStructures(modStructureId, instrumentModStructures);
                }
                else
                {
                    model.SetError("Name", "Duplicate Mod Structure name");
                }

                return Ok(model);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/modstructures/attachment/{modStructureId}")]
        [HasPermission(Infrastructure.Filters.Permission.ManageModStructure)]
        public async Task<IHttpActionResult> Create(int modStructureId)
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var provider = new InMemoryMultipartFormDataStreamProvider();
            try
            {
                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);
                foreach (HttpContent file in provider.Files)
                {
                    using (Stream stream = await file.ReadAsStreamAsync())
                    {
                        using (var br = new BinaryReader(stream))
                        {
                            var length = (int)stream.Length;
                            _structuresService.InsertAttachment(modStructureId,
                                file.Headers.ContentDisposition.FileName.Replace("\"", ""),
                                br.ReadBytes(length));
                        }
                    }
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("unsupported file type");
            }
        }

        // DELETE: api/modstructures/5
        [HttpDelete]
        [Route("api/modstructures/{modStructureId}")]
        [HasPermission(Infrastructure.Filters.Permission.ManageModStructure)]
        public IHttpActionResult Delete(int modStructureId)
        {
            var item = _structuresService.GetModStructure(modStructureId);
            if (item == null)
                return NotFound();

            _structuresService.DeleteModStructure(item);
            return Ok(item);
        }

        private ExpandoObject GetModStructuresByBase(int ordinalPosition, string baseChar)
        {
            dynamic result = new ExpandoObject();

            var items = _structuresService.GetAllModStructures().Where(m => m.Base == baseChar);
            var locatedModStructures = new List<ModStructureModel>();
            result.Base = baseChar;
            result.OrdinalPosition = ordinalPosition;
            result.SelectedModStructure = "";
            foreach (var item in items)
            {
                var modStructure = new ModStructureModel();
                Mapper.Map(item, modStructure);
                locatedModStructures.Add(modStructure);
                if (locatedModStructures.Count == 1)
                {
                    result.SelectedModStructure = locatedModStructures.Last();
                }
            }
            result.ModStructures = locatedModStructures;

            return result;
        }
    }
}
