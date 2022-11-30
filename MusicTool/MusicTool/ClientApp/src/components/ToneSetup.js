import React, { Component } from 'react';
import * as Tone from 'tone';


export class ToneExample extends Component {

    constructor(props) {
        super(props);
        
        Tone.start();
        Tone.start();
        this.synth = new Tone.Synth();
        Tone.start();
        Tone.start();
        Tone.start();
        Tone.start();
        this.state = { synth: this.synth };
    }

    PlayNote() {
        console.log("woof");
        this.synth.triggerAttackRelease('C4', '8n', 0);
    }


    render() {
        
        return (
            <div>
                <br></br><br></br><br></br><br></br>
                <h1>Workspace</h1>
            </div>
        );

    }
}
export default ToneExample