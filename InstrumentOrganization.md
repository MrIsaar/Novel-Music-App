# Instrument Organization
This document describes the logic behind the organization and implementation of the instruments within the music app.

## Background
All of the sound-based features of the music app are implemented using Tone.js, a high-performance and extremely versatile music library written on top of the web audio API. In Tone.js, most sounds are produced using synthesizers of various kinds:

- Synth
    - The most basic type. This synthesizer uses a pure tone generator with some basic settings available to modify the sound it generates.
- MonoSynth
    - Uses an internal filter to give much more customization to the sound.
- DuoSynth
    - Uses two internal MonoSynths simultaneously to give a layered effect to the sound.
- PolySynth
    - Is simply a wrapper around any of the monophonic synths to allow them to be polyphonic.
- AMSynth
    - Uses amplitude modulation to modify the sound of another synth
- FMSynth
    - Uses frequency modulation to modify the sound of another synth
- MembraneSynth
    - Mimics the sound of a tom or kick drum by using a pure tone generator and several internal filters.
- MetalSynth
    - Mimics the sound of cymbals and other metalophones.
- NoiseSynth
    - Uses a noise source and a simple filter to create noise-based sounds like claps, snare drums, etc.
- PluckSynth
    - Uses a special physical string-modeling algorithm to create string-like sounds
- Sampler
    - Uses an external sample file along with automatic repitching to allow using your own samples as the source of the synth notes.

At this time, the music app provides the user with three possible synthesizers, though eventually we hope to expose the full capability of Tone.js. These three synthesizers are described using basic physical instruments to make it more welcoming to inexperienced digital musicians.

- Drum
    - Implemented using a MembraneSynth
- Cymbal
    - Implemented using a MetalSynth
- Clap
    - Implemented using a NoiseSynth

Each instrument object placed on the work area is represented by an Instrument object which has "physical" properties such as its shape, position, rotation, as well as "aural" properties such as the synthesizer and the note.

## Triggering Sounds
Sounds are triggered upon collisions between balls (or "marbles") and instrument objects. The sound itself comes from calling the synth.TriggerAttackRelease(note) method on the instruments internal synth object.

The launching of marbles is triggered by a sequencer track. Each track of the sequencer is associated with a single cannon object. Whenever that track plays a note, the cannon fires a single marble. 