
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MusicTool
{
    // Based on https://www.ryadel.com/en/serialize-string-value-without-quotes-asp-net-core-newtonsoft-json/
    /// <summary>
    /// Converts string values without quotes, allowing to pass JS functions references (or even a whole JS function) as values in a JSON result.
    /// ref.: https://stackoverflow.com/a/15662075/1233379
    /// 
    /// BEFORE: { "name": "value" }
    /// AFTER:  { "name": value }
    /// </summary>
    public class RawStringValueConverter : JsonConverter<string>
    {
        public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.GetString();
        }

        public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
        {
            writer.WriteRawValue(value);
        }
    }
}
