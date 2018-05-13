using GSM.Models;
using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.ValueProviders;
using GSM.Utils;

namespace GSM.API.Controllers
{
    [Authorize]
    public class UserSettingsController : ApiController
    {
        // GET api/<controller>/5
        [Route("api/usersettings")]
        public IHttpActionResult Get()
        {
            try
            {
                var userSettings = new UserSettings
                {
                    TargetSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.TargetSearchSettings),

                    InstrumentSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.InstrumentSearchSettings),

                    SpeciesSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.SpeciesSearchSettings),

                    ModStructureSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.ModStructureSearchSettings),

                    ModifierTemplateSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.ModifierTemplateSearchSettings),

                    StrandSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.StrandSearchSettings),

                    DuplexSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.DuplexSearchSettings),

                    MaterialRequestSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.MaterialRequestSearchSettings),

                    SynthesisRequestSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.SynthesisRequestSearchSettings),

                    StrandBatchSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.StrandBatchSearchSettings),

                    DuplexBatchSearchSettings =
                        UserSettingsHelper.GetSearchSettings(UserSettingsHelper.DuplexBatchSearchSettings)
                };


                //material  Request Settings

                //synthesis request settings

                return Ok(userSettings);
            }
            catch (Exception)
            {

                return InternalServerError();
            }
        }

        [Route("api/usersettings/{key}")]
        public IHttpActionResult Get([FromUri] string key)
        {
            try
            {
                var settings = UserSettingsHelper.GetSearchSettings(key);
                if (settings == null)
                    return NotFound();

                var coulumnDisplayOrder = UserSettingsHelper.GetSearchSettings(settings);
                return Ok(coulumnDisplayOrder);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/usersettings/{key}")]
        public IHttpActionResult PostByKey([FromUri]string key, [FromBody] IDictionary<string, object> columnDisplayOrder)
        {
            try
            {
                var settings = UserSettingsHelper.GetSearchSettings(key);
                if (settings != null)
                {
                    UserSettingsHelper.SetSearchSettings(columnDisplayOrder, settings);
                }

                return Ok();
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        // POST api/<controller>
        [HttpPost]
        [Route("api/usersettings")]
        [ValueProvider(typeof(System.Web.Mvc.JsonValueProviderFactory))]
        public IHttpActionResult Post([FromBody] UserSettings userSettings)
        {
            try
            {
                UserSettingsHelper.SetSearchSettings(userSettings.TargetSearchSettings,
                    UserSettingsHelper.TargetSearchSettings);

                UserSettingsHelper.SetSearchSettings(userSettings.InstrumentSearchSettings,
                    UserSettingsHelper.InstrumentSearchSettings);

                UserSettingsHelper.SetSearchSettings(userSettings.SpeciesSearchSettings,
                    UserSettingsHelper.SpeciesSearchSettings);

                UserSettingsHelper.SetSearchSettings(userSettings.ModStructureSearchSettings,
                    UserSettingsHelper.ModStructureSearchSettings);

                UserSettingsHelper.SetSearchSettings(userSettings.ModifierTemplateSearchSettings,
                    UserSettingsHelper.ModifierTemplateSearchSettings);

                UserSettingsHelper.SetSearchSettings(userSettings.StrandSearchSettings,
                    UserSettingsHelper.StrandSearchSettings);

                UserSettingsHelper.SetSearchSettings(userSettings.DuplexSearchSettings,
                    UserSettingsHelper.DuplexSearchSettings);

                //material  Request Settings
                UserSettingsHelper.SetSearchSettings(userSettings.MaterialRequestSearchSettings,
                    UserSettingsHelper.MaterialRequestSearchSettings);

                //synthesis  Request Settings
                UserSettingsHelper.SetSearchSettings(userSettings.SynthesisRequestSearchSettings,
                    UserSettingsHelper.SynthesisRequestSearchSettings);

                UserSettingsHelper.SetSearchSettings(userSettings.StrandBatchSearchSettings,
                    UserSettingsHelper.StrandBatchSearchSettings);

                UserSettingsHelper.SetSearchSettings(userSettings.DuplexBatchSearchSettings,
                    UserSettingsHelper.DuplexBatchSearchSettings);

                return Ok();
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}