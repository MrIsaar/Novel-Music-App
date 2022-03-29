import React, { Component } from 'react';
import * as Tone from 'tone';


export class ToneExample extends Component {

    constructor(props) {
        super(props);

        Tone.start();
        this.synth = new Tone.Synth();
    }

    PlayNote() {
        this.triggerAttackRelease('C4', '8n', 0);
    }


    render() {

        return (
            <div>
                <h1>ToneDemo</h1>
            </div>
        );

    }
}
