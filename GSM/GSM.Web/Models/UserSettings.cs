using System.Collections.Generic;
using System.Runtime.Serialization;

namespace GSM.Models
{
    [DataContract(Name = "usersettings")]
    public class UserSettings
    {
        [DataMember(Name = "targetsearch")]
        public IDictionary<string, object> TargetSearchSettings { get; set; }

        [DataMember(Name = "instrumentsearch")]
        public IDictionary<string, object> InstrumentSearchSettings { get; set; }

        [DataMember(Name = "speciessearch")]
        public IDictionary<string, object> SpeciesSearchSettings { get; set; }

        [DataMember(Name = "modstructuresearch")]
        public IDictionary<string, object> ModStructureSearchSettings { get; set; }

        [DataMember(Name = "modifiertemplatesearch")]
        public IDictionary<string, object> ModifierTemplateSearchSettings { get; set; }

        [DataMember(Name = "strandsearch")]
        public IDictionary<string, object> StrandSearchSettings { get; set; }

        [DataMember(Name = "strandbatchsearch")]
        public IDictionary<string, object> StrandBatchSearchSettings { get; set; }

        [DataMember(Name = "duplexsearch")]
        public IDictionary<string, object> DuplexSearchSettings { get; set; }

        [DataMember(Name = "materialrequestsearch")]
        public IDictionary<string, object> MaterialRequestSearchSettings { get; set; }

        [DataMember(Name = "synthesisrequestsearch")]
        public IDictionary<string, object> SynthesisRequestSearchSettings { get; set; }

        [DataMember(Name = "duplexbatchsearchsettings")]
        public IDictionary<string, object> DuplexBatchSearchSettings { get; set; }
    }
}