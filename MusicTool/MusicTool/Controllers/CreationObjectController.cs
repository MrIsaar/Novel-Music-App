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
    }
}
