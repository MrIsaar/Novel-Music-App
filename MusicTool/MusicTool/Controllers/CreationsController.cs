#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using MusicTool.Areas.Application.Data;
using MusicTool.Data;

namespace MusicTool.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreationsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public CreationsController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Creations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Creation>>> GetCreation()
        {
            return await _context.Creation.ToListAsync();
        }
        // GET: api/Creations/new
        [HttpGet("new/{id}")]
        public async Task<ActionResult<Creation>> NewCreation(int id)
        {
            var context = _context;
            int cID = -1;
            Creation c = new Creation();

            c.CreationDate = DateTime.Now;
            c.LastEditDate = DateTime.Now;
            c.WorldRules = "{\"gravity\": 1, \"background\": \"blue\"}";
            c.Name = "NewCreation";
            context.Creation.Add(c);
            context.SaveChanges();
            
            var allCreation = context.Creation.ToList();
            cID = allCreation[allCreation.Count -1 ].CreationID;
            {

                context.CreationObject.AddRange(
                new CreationObject[]
                {
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{ \"MTObjType\": \"Cannon\", \"MTObjVersion\": \"1.0.0\",\"objectNumber\": \"0\", \"position\": { \"x\": 200, \"y\": 100 }, \"angle\": 0, \"image\": null, \"shape\": [ { \"x\": -20, \"y\": -20 }, { \"x\": 40, \"y\": 0 }, { \"x\": -20, \"y\": 20 }, { \"x\": -30, \"y\": 0 } ], \"collisionFilter\": { \"group\": 0, \"category\": 0, \"mask\": 0 }, \"fireLayer\": 1, \"power\": 20, \"marbleSize\": 20, \"marbleColor\": \"rand\", \"marbleCollisionFilter\": { \"group\": -1, \"category\": 4294967295, \"mask\": 4294967295 } }",

                        Type = "Cannon"
                    },
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{\"MTObjType\":\"Instrument\",\"MTObjVersion\":\"1.0.0\", \"objectNumber\": \"0\", \"position\":{\"x\":400,\"y\":150},\"angle\":0,\"image\":null,\"synthtype\":\"Metal\",\"synthrules\":{ \"pitchDecay\": \"0.008\", \"octaves\": \"2\", \"envelope\": { \"attack\": \"0.0006\", \"decay\": \"0.5\", \"sustain\": \"0\" }},\"shape\":[{\"x\":-25,\"y\":-10},{\"x\":25,\"y\":-10},{\"x\":20,\"y\":10},{\"x\":-20,\"y\":10}],\"collisionFilter\":{ \"group\": 0, \"category\": 4294967295, \"mask\": 4294967295},\"sound\":{ \"note\":\"E4\",\"length\":\"8n\"}}",
                        Type="Instrument"
                    }
                });


                Sequencer s = new Sequencer();
                s.CreationID = cID;
                s.Json = "{\"tracks\": [{\"name\": \"track1\", \"id\": 1, \"notes\": [false, false, false, false, false, false]}, {\"name\": \"track2\", \"id\": 2, \"notes\": [false, false, false, false, false, false]},{\"name\": \"track3\", \"id\": 3, \"notes\": [false, false, false, false, false, false]}]}";
                context.Sequencer.Add(s);


                Access a = new Access();
                a.CreationID = cID;
                a.UserID = "" + id;
                a.AccessLevel = AccessLevel.Owner;
                context.Access.Add(a);

                context.SaveChanges();
                
            }
            var creation = await _context.Creation.Include(cr => cr.Sequencer).Include(cr => cr.CreationObject).Where(cr => cr.CreationID == cID).FirstOrDefaultAsync();

            if (creation == null)
            {
                return NotFound();
            }

            return creation;
        }

        [HttpGet("summaries")]
        public async Task<ActionResult<IEnumerable<CreationSummaryDto>>> GetCreationSummaries()
        {
            var creations = from c in _context.Creation
                            select new CreationSummaryDto()
                            {
                                CreationDate = c.CreationDate,
                                CreationID = c.CreationID,
                                LastEditDate = c.LastEditDate,
                                Name = c.Name,
                                CreationObjectCount = c.CreationObject.Count()
                            };

            return await creations.ToListAsync();
        }

        

        // GET: api/Creations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Creation>> GetCreation(int id)
        {
            //var creation = await _context.Creation.FindAsync(id);
            // include these to avoid issues with lazy loading
            var creation = await _context.Creation.Include(c => c.Sequencer).Include(c => c.CreationObject).Where(c => c.CreationID == id).FirstOrDefaultAsync();

            if (creation == null)
            {
                return NotFound();
            }

            return creation;
        }

        [HttpGet("{id}/objects")]
        public async Task<ActionResult<IEnumerable<CreationObject>>> GetCreationObjects(int id)
        {
            var creation = await _context.Creation.Include(c => c.CreationObject).Where(c => c.CreationID == id).FirstOrDefaultAsync();

            if (creation == null)
            {
                return NotFound();
            }
            
            return creation.CreationObject.ToList();
        }


        // e.g list?page=1&size=20&keyword=aaa [FromQuery] Creation creation1
        // POST: api/Creations/save/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("save/{id}")]
        public async Task<ActionResult<Creation>> PostCreation(int id, [FromBody] Creation creation)
        {
            if (id != creation.CreationID)
            {
                return new BadRequestObjectResult(new { message = "id != CreationID" });
            }

            if (creation is null)
            {
                return new BadRequestObjectResult(new { message = "creation is null" });
            }
            

            _context.Entry(creation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CreationExists(id))
                {
                    new BadRequestObjectResult(new { message = "creation id not exist" });
                }
                else
                {
                    throw;
                }
            }

            var res = await _context.Creation.Where((p => p.CreationID == id)).FirstOrDefaultAsync();
            if (res == null)
            {
                // pop message
                return new BadRequestObjectResult(new { message = "Fail to get creation" });
            }
            return res;
        }

        // POST: api/Creations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Creation>> PostCreation(Creation creation)
        {
            _context.Creation.Add(creation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCreation", new { id = creation.CreationID }, creation);
        }

        // DELETE: api/Creations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCreation(int id)
        {
            var creation = await _context.Creation.FindAsync(id);
            if (creation == null)
            {
                return NotFound();
            }

            _context.Creation.Remove(creation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CreationExists(int id)
        {
            return _context.Creation.Any(e => e.CreationID == id);
        }
    }
}
