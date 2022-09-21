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


        // PUT: api/Creations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCreation(int id, Creation creation)
        {
            if (id != creation.CreationID)
            {
                return BadRequest();
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
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
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
