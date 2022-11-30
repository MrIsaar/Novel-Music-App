using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MusicTool.Areas.Application.Data;

public enum AccessLevel
{
    Read, Write, Owner
}
public class Access
{
    public Access() { }
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AccessID { get; set; }
    public string UserID { get; set; }
    public int CreationID { get; set; }
    public AccessLevel AccessLevel { get; set; }
    /*[JsonIgnore]
    public virtual Creation? Creation { get; set; }*/

}

