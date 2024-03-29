﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MusicTool.Areas.Application.Data
{

    // Add profile data for application users by adding properties to the MusicToolUser class
    public class Sequencer
    {
        public Sequencer() { }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SequencerID { get; set; }
        
        [JsonConverter(typeof(RawStringValueConverter))]
        public string? Json { get; set; }
        public int CreationID { get; set; }

        // if this is included, the serializer encounters a circular reference.
        // There are workarounds that we can use if necessary but they're not needed for now.
        // see https://docs.microsoft.com/en-us/aspnet/web-api/overview/formats-and-model-binding/json-and-xml-serialization#handling_circular_object_references
        // see https://docs.microsoft.com/en-us/aspnet/web-api/overview/data/using-web-api-with-entity-framework/part-4
        
        // see https://docs.microsoft.com/en-us/aspnet/web-api/overview/data/using-web-api-with-entity-framework/part-5
        // this is probably the method we would want to use ^^
        //public virtual Creation Creation { get; set; }
    }
}

