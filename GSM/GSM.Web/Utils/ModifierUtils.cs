using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GSM.Utils
{
    public class ModifierUtils
    {
        private const char PLACEHOLDER = 'X';
        private const char SEPARATOR = ',';
        private const string NULLBASECHAR = " ";

        public static string GetModifiedAsString(int unmodifiedFirstPosition, string unmodifiedStr, int templateFirstPosition, string templateStr)
        {
            var result = new StringBuilder();

            var items = GetModifiedAsListString(unmodifiedFirstPosition, unmodifiedStr, templateFirstPosition, templateStr);
            items.ForEach(item =>
            {
                if (item != null)
                {
                    result.Append(item + SEPARATOR);                    
                }
            });
            result.Remove(result.Length - 1, 1);
            return result.ToString();
        }

        public static List<string> GetModifiedAsListString(int unmodifiedFirstPosition, string unmodifiedStr, int templateFirstPosition, string templateStr)
        {
            var result = new List<string>();

            // Set my arrays
            var unmodifiedArray = unmodifiedStr.ToArray();
            var templateArray = templateStr.Split(SEPARATOR);

            var largestFirstPosition = unmodifiedFirstPosition > templateFirstPosition ? unmodifiedFirstPosition : templateFirstPosition;
            var seqareArrayLength = SquareArrayLength(unmodifiedFirstPosition, unmodifiedStr, templateFirstPosition, templateStr);
            var unmodifiedStartIndex = StartingIndex(largestFirstPosition, unmodifiedFirstPosition);
            var templateStartIndex = StartingIndex(largestFirstPosition, templateFirstPosition);
            for (int i = 0; i < seqareArrayLength; i++)
            {
                var unMod = GetArrayItem(unmodifiedStartIndex++, unmodifiedArray);
                var templ = GetArrayItem(templateStartIndex++, templateArray);
                result.Add(GetModified(templ, unMod));
            }

            return result;
        }

        public static int SquareArrayLength(int unmodifiedFirstPosition, string unmodifiedStr, int templateFirstPosition, string templateStr)
        {
            int lhsLength = unmodifiedFirstPosition > templateFirstPosition
                ? unmodifiedFirstPosition
                : templateFirstPosition;
            var unmodifiedRhsLength = unmodifiedStr.Length - unmodifiedFirstPosition;
            var templateRhsArray = templateStr.Split(SEPARATOR).Length - templateFirstPosition;
            int rhsLength = unmodifiedRhsLength > templateRhsArray ? unmodifiedRhsLength : templateRhsArray;

            return lhsLength + rhsLength;
        }

        public static int StartingIndex(int largestFirstPosition, int firstPosition)
        {
            return largestFirstPosition == firstPosition ? 0 : firstPosition - largestFirstPosition;
        }

        private static string GetModified(string templateItem, string unmodifiedItem)
        {
            // If we have no templateItem but have an unmodifiedItem we just drop the item
            if (templateItem == null && unmodifiedItem != null) return null;
            // If we have a templateItem which does not contain the template replace char just resturn the templateItem
            if (templateItem != null && !ContainsTemplateCharacter(templateItem)) return templateItem;
            // If we have no unmodifiedItem but have a templateItem that does contain a template replace char reutrn a ? 
            if ((unmodifiedItem == null || unmodifiedItem == NULLBASECHAR) && templateItem != null && ContainsTemplateCharacter(templateItem)) return "?";
            // At this point we have a comparison to make
            if (templateItem.Contains(PLACEHOLDER.ToString().ToUpper()))
            {
                return templateItem.Replace(PLACEHOLDER.ToString().ToUpper(), unmodifiedItem.ToUpper());
            }
            if (templateItem.Contains(PLACEHOLDER.ToString().ToLower()))
            {
                return templateItem.Replace(PLACEHOLDER.ToString().ToLower(), unmodifiedItem.ToLower());
            }

            return null;
        }

        private static string GetArrayItem(int index, string[] item)
        {
            if (index < 0 || index > item.Length - 1) return null;
            return item[index];
        }

        private static string GetArrayItem(int index, char[] item)
        {
            if (index < 0 || index > item.Length - 1) return null;
            return item[index].ToString();
        }

        private static bool ContainsTemplateCharacter(string str)
        {
            return str.Contains(PLACEHOLDER.ToString().ToUpper()) || str.Contains(PLACEHOLDER.ToString().ToLower());
        }
    }
}