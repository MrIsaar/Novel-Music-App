#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicTool.Areas.Application.Data;
using MusicTool.Data;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using NuGet.Protocol;

namespace MusicTool.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreationObjectController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public CreationObjectController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/creationobject
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CreationObject>>> GetCreationObject()
        {
            return await _context.CreationObject.ToListAsync();
        }

        // POST api/getObject/withCreationID/1
        [HttpGet("getObject/withCreationID/{id}")]
        public async Task<List<CreationObject>> GetCreationObjectList(int id)
        {
            var list = from item in _context.CreationObject
                       where item.CreationID == id
                       select item;
            return await list.ToListAsync();
        }

        // POST: api/creationobject/save/2
        // postman returns 1 if success
        [HttpPost("save/{id}")]
        public async Task<ActionResult<CreationObject>> SaveCreationObject(int id, [FromBody] CreationObject creationObject)
        {
            if (id != creationObject.CreationID)
            {
                return new BadRequestObjectResult(new { message = "id != CreationID" });
            }
            var data = (JObject)JsonConvert.DeserializeObject(creationObject.Json);
            var objectNumber = data["objectNumber"].Value<int>();
           

            var objectType = data["MTObjType"].Value<string>();
            if (creationObject.Type != objectType)
            {
                return new BadRequestObjectResult(new { message = "object type in saved json does not match type in creation Object" });
            }

            var res = await _context.CreationObject.Where(p => p.CreationID == creationObject.CreationID && p.CreationObjectID == objectNumber).ToListAsync();
            if (res != null && res.Count > 0)
            {
                // TODO: replace with updating the db with new json
                return new StatusCodeResult(418); // the server is a teapot
            }

            await _context.CreationObject.AddAsync(creationObject);
            await _context.SaveChangesAsync();

            return creationObject;
        }

        // auto delete all CreationObjects related to this creationID
        // DELETE: api/Creations/{creationID} <- handled by creationsController

        // DELETE: api/creationobject/3
        // HINT: CreationObjectID != CreationID
        // TODO: need a way to get CreationObjectID
        [HttpDelete("{CreationObjectID}")]
        public async Task<IActionResult> DeleteCreationObject(int CreationObjectID)
        {
            var res = await _context.CreationObject.Where(p => p.CreationObjectID == CreationObjectID).FirstOrDefaultAsync();
            if (res == null)
            {
                return new BadRequestObjectResult(new { message = "CreationObject not found." });
            }

            _context.CreationObject.Remove(res);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
