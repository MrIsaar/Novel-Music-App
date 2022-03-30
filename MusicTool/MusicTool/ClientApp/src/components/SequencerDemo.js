import React, { Component } from 'react';
import { Sequencer } from './Sequencer';
import * as Tone from 'tone';


export class SequencerDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            numTracks: 4,
            numSteps: 16
        }
        
        this.instruments = [];
        for (let i = 0; i < this.state.numTracks; i++) {
            this.instruments.push(new Tone.Synth().toDestination());
        }

        this.notes = ['C4', 'G3', 'E3', 'C3'];

    }

    
    render() {
        let callbacks = [
            () => this.instruments[0].triggerAttackRelease(this.notes[0], '8n'),
            () => this.instruments[1].triggerAttackRelease(this.notes[1], '8n'),
            () => this.instruments[2].triggerAttackRelease(this.notes[2], '8n'),
            () => this.instruments[3].triggerAttackRelease(this.notes[3], '8n')
        ];
    
        
        return (
            <div className="sequencer-demo">
                <h1>Sequencer Demo</h1>
                <button onClick={() => Tone.start()}>Start Tone</button>
                <button onClick={() => this.instruments[1].triggerAttackRelease(this.notes[1], '8n')}>Play Test Note</button>
                <Sequencer
                    numTracks={this.state.numTracks}
                    numSteps={this.state.numSteps}
                    callbacks={ callbacks }
                />
            </div>
        )
    }
}

