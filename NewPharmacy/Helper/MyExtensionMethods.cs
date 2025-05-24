﻿using System.Text.RegularExpressions;

namespace NewPharmacy.Helper;

public static class MyExtensionMethods
{
    public static string RemoveTags(this string input)
    {
        return Regex.Replace(input, "<.*?>", string.Empty);
    }

    public static List<T> GetRandomElements<T>(this IEnumerable<T> list, int elementsCount)
    {
        return list.OrderBy(arg => Guid.NewGuid()).Take(elementsCount).ToList();
    }

    public static string RandomString(int size)
    {
        System.Text.StringBuilder builder = new System.Text.StringBuilder();
        Random random = new Random();
        char ch;
        for (int i = 0; i < size; i++)
        {
            ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
            builder.Append(ch);
        }
        return builder.ToString();
    }

    public static byte[] MyParseBase64(this string base64string)
    {
        base64string = base64string.Split(',')[1];
        return Convert.FromBase64String(base64string);
    }
}