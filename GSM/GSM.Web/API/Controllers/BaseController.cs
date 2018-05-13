using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using GSM.Data.Models;

namespace GSM.API.Controllers
{
    public enum SortOrder
    {
        asc,
        desc,
        none
    }

    public class BaseController : ApiController
    {
        private const string ColumnSeparator = "\t";
        protected HttpResponseMessage GetCsv(string resultFileName, StringCollection columnDisplayOrder, IEnumerable<object> filteredSet)
        { 
            var headerColumns = columnDisplayOrder.Cast<string>().ToList();
            var content = GetStreamContent(headerColumns, filteredSet);
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = content;
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/csv");
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = string.Format("{0}Search_{1}.csv", resultFileName, DateTime.Now.ToString("yyyMMdd_hh_mm_ss"))
            };
            return response;
        }

        protected string BuildCSVRow<T>(List<string> headerColumns, T item)
        {
            var values = headerColumns.ToDictionary(key => key, value => string.Empty);
            foreach (var header in headerColumns)
            {
                var value = GetDeepPropertyValue(item, header);
                values[header] = value != null ? string.Format(CultureInfo.InvariantCulture, "{0}", value) : string.Empty;
            }

            return string.Join(ColumnSeparator, values.Values.ToArray());
        }

        protected HttpResponseMessage GetFile(string fileName, byte[] data)
        {
            var result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new StreamContent(new MemoryStream(data));
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = fileName
            };

            return result;
        }

        protected User GetCurrentUser()
        {
            using (var context = new GeneSythesisDBContext())
            {
                return context.Users.FirstOrDefault(u => u.Name.Equals(User.Identity.Name));
            }
        }

        private StreamContent GetStreamContent(IList<string> headerColumns, IEnumerable<object> filteredSet)
        {
            //
            // Construct the CSV - for now this is done in memory.  If this becomes a performance issue
            // we can change to using a file
            // NOTE!! - We are intentionally NOT cleaning up/closing the MemoryStream and StreamWriter instances
            // but instead letting .NET clean them up so they can live long enough to provide the data for the HttpResponse
            //

            var ms = new MemoryStream();
            var writer = new StreamWriter(ms);

            //
            // Write out the header row
            //
            writer.WriteLine("sep={0}", ColumnSeparator);
            writer.WriteLine(string.Join(ColumnSeparator, headerColumns.ToArray()));

            //
            // Build and write out each instance row
            //
            foreach (var item in filteredSet)
            {
                writer.WriteLine(BuildCSVRow(headerColumns.ToList(), item));
            }
            // 
            // Flush pending writes to the stream
            //
            writer.Flush();

            //
            // Reset the position of the memory stream
            //
            ms.Seek(0, SeekOrigin.Begin);
            return new StreamContent(ms);
        }

        private static object GetDeepPropertyValue<T>(T item, string property)
        {
            if (string.IsNullOrEmpty(property))
                return default(T);

            object result = item;
            var type = item.GetType();
            var nestedProperties = property.Split('.');
            foreach (string propertyName in nestedProperties)
            {
                var propertyInfo = type.GetProperty(propertyName);
                if (propertyInfo == null) break;

                if (result != null)
                {
                    result = propertyInfo.GetValue(result, null);
                    type = propertyInfo.PropertyType;
                }
            }

            return result;
        }
    }
}