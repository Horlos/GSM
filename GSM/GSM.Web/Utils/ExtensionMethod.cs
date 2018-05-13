using System;

namespace GSM.Utils
{
    public static class MyExtensions
    {
        public static string SafeString(this String str)
        {
            return str ?? string.Empty;
        }

        public static string NoDelimiter(this String str)
        {
            if (str != null)
                return str.Replace(",", "");

            return string.Empty;
        }

        public static string SafeString(this Nullable<decimal> dec)
        {
            if (dec != null)
                return dec.ToString();

            return   string.Empty;
        }
    }   
}