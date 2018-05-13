using System.Collections.Generic;
using System.Linq;

namespace GSM.API.Models
{
    public class APIModelBase
    {
        private readonly IDictionary<string, string> _errors;

        public APIModelBase()
        {
            _errors = new Dictionary<string, string>();
        }

        public IDictionary<string, string> Errors
        {
            get { return _errors; }
        }

        public void SetError(string column, string description)
        {
            if (!Errors.ContainsKey(column))
            {
                Errors.Add(column, description);
            }
            else
            {
                Errors[column] += description;
            }
        }

        public string GetError(string column)
        {
            return Errors.ContainsKey(column) ? Errors[column] : string.Empty;
        }

        public bool HasErrors
        {
            get
            {
                return Errors.Any();
            }
        }
    }
}