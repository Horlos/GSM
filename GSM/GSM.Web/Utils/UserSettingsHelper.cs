using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace GSM.Utils
{
    public class UserSearchSettings
    {
        public UserSearchSettings(string searchSettingsGroupName, string columnDisplayOrderPropertyName)
        {
            SearchSettingsGroupName = searchSettingsGroupName;
            ColumnDisplayOrderPropertyName = columnDisplayOrderPropertyName;
        }

        public string SearchSettingsGroupName { get; set; }
        public string ColumnDisplayOrderPropertyName { get; set; }
    }

    public class UserSettingsHelper
    {
        private static IDictionary<string, UserSearchSettings> _userSearchSettings;

        public static IDictionary<string, UserSearchSettings> UserSearchSettings
        {
            get
            {
                if (_userSearchSettings == null)
                    RegisterSettings();

                return _userSearchSettings;
            }
        }

        public static UserSearchSettings DuplexSearchSettings
        {
            get { return GetSearchSettings("DuplexSearchSettings"); }
        }
        public static UserSearchSettings InstrumentSearchSettings
        {
            get { return GetSearchSettings("InstrumentSearchSettings"); }
        }
        public static UserSearchSettings TargetSearchSettings
        {
            get { return GetSearchSettings("TargetSearchSettings"); }
        }
        public static UserSearchSettings MaterialRequestSearchSettings
        {
            get { return GetSearchSettings("MaterialRequestSearchSettings"); }
        }
        public static UserSearchSettings ModifierTemplateSearchSettings
        {
            get { return GetSearchSettings("ModifierTemplateSearchSettings"); }
        }
        public static UserSearchSettings ModStructureSearchSettings
        {
            get { return GetSearchSettings("ModStructureSearchSettings"); }
        }
        public static UserSearchSettings SpeciesSearchSettings
        {
            get { return GetSearchSettings("SpeciesSearchSettings"); }
        }
        public static UserSearchSettings StrandSearchSettings
        {
            get { return GetSearchSettings("StrandSearchSettings"); }
        }
        public static UserSearchSettings SynthesisRequestSearchSettings
        {
            get { return GetSearchSettings("SynthesisRequestSearchSettings"); }
        }
        public static UserSearchSettings StrandBatchSearchSettings
        {
            get { return GetSearchSettings("StrandBatchSearchSettings"); }
        }
        public static UserSearchSettings DuplexBatchSearchSettings
        {
            get { return GetSearchSettings("DuplexBatchSearchSettings"); }
        }

        public static UserSearchSettings GetSearchSettings(string key)
        {
            UserSearchSettings userSearchSettings;
            if (UserSearchSettings.TryGetValue(key, out userSearchSettings))
                return userSearchSettings;

            return null;
        }

        public static IDictionary<string, object> GetSearchSettings(UserSearchSettings userSearchSettings)
        {
            var searchSettingsGroupName = userSearchSettings.SearchSettingsGroupName;
            var columnDisplayOrderPropertyName = userSearchSettings.ColumnDisplayOrderPropertyName;
            var result = new Dictionary<string, object>();
            var profileGroup = HttpContext.Current.Profile.GetProfileGroup(searchSettingsGroupName);
            result.Add(columnDisplayOrderPropertyName, profileGroup.GetPropertyValue(columnDisplayOrderPropertyName));
			result.Add("pageSize", profileGroup.GetPropertyValue("pageSize"));
			return result;
        }

        public static void SetDefaultSearchSettings(UserSearchSettings userSearchSettings, StringCollection defaultColumnDisplayOrder)
        {
            try
            {
                // WNM - This is lame but gets the point across.
                // I'm hard-casting as I'd rather throw due to incorrect type than have to guess 
                // what happend
                var profile = HttpContext.Current.Profile;
                var searchSettingsGroupName = userSearchSettings.SearchSettingsGroupName;
                var columnDisplayOrderPropertyName = userSearchSettings.ColumnDisplayOrderPropertyName;
                var profileGroup = profile.GetProfileGroup(searchSettingsGroupName);
                var columnDisplayOrder = (StringCollection)profileGroup.GetPropertyValue(columnDisplayOrderPropertyName);
                if (columnDisplayOrder.Count == 0)
                {
                    // Initialize with some sensible defaults - mostly likely retrieved from the database
                    columnDisplayOrder = defaultColumnDisplayOrder;
                    profileGroup.SetPropertyValue(columnDisplayOrderPropertyName, columnDisplayOrder);
                }

                if (profile.IsDirty)
                {
                    profile.Save();
                }
            }
            catch (Exception)
            {
                // WNM - most likely an ASP.Net profile configuration issue.  
                // See the 'README_DeveloperInstructions.txt file for details
                // on how to configure Profile properties
            }
        }

        public static void SetSearchSettings(IDictionary<string, object> searchSettings, UserSearchSettings userSearchSettings)
        {
			if (searchSettings == null)
				return;

            var searchSettingsGroupName = userSearchSettings.SearchSettingsGroupName;
            var columnDisplayOrderPropertyName = userSearchSettings.ColumnDisplayOrderPropertyName;
            var searchSettingsGroup = HttpContext.Current.Profile.GetProfileGroup(searchSettingsGroupName);
			foreach(var preference in searchSettings)
			{
				if (preference.Key == columnDisplayOrderPropertyName)
				{
					var collection = new StringCollection();
					JArray strValues = searchSettings[columnDisplayOrderPropertyName] as JArray;
					if (strValues != null)
					{
						collection.AddRange(strValues.ToList().ConvertAll(item => item.ToString()).ToArray());
						searchSettingsGroup.SetPropertyValue(columnDisplayOrderPropertyName, collection);
					}
				}
				else
				{
					var pageSize = searchSettingsGroup.GetPropertyValue(preference.Key);
					pageSize = Convert.ToInt32(preference.Value);
					searchSettingsGroup.SetPropertyValue(preference.Key, pageSize);
				}
			}
        }

        private static void RegisterSettings()
        {
            _userSearchSettings = new Dictionary<string, UserSearchSettings>
            {
                {"DuplexSearchSettings", new UserSearchSettings("DuplexSearchSettings", "columnDisplayOrder")},
                {"InstrumentSearchSettings", new UserSearchSettings("InstrumentSearchSettings", "columnDisplayOrder")},
                {"TargetSearchSettings", new UserSearchSettings("TargetSearchSettings", "columnDisplayOrder")},
                {"MaterialRequestSearchSettings", new UserSearchSettings("MaterialRequestSearchSettings", "columnDisplayOrder")},
                {"ModifierTemplateSearchSettings", new UserSearchSettings("ModifierTemplateSearchSettings", "columnDisplayOrder")},
                {"ModStructureSearchSettings", new UserSearchSettings("ModStructureSearchSettings", "columnDisplayOrder")},
                {"SpeciesSearchSettings", new UserSearchSettings("SpeciesSearchSettings", "columnDisplayOrder")},
                {"StrandSearchSettings", new UserSearchSettings("StrandSearchSettings", "columnDisplayOrder")},
                {"SynthesisRequestSearchSettings", new UserSearchSettings("SynthesisRequestSearchSettings", "columnDisplayOrder")},
                {"StrandBatchSearchSettings", new UserSearchSettings("StrandBatchSearchSettings", "columnDisplayOrder")},
                {"DuplexBatchSearchSettings", new UserSearchSettings("DuplexBatchSearchSettings", "columnDisplayOrder")}
            };

        }
    }
}