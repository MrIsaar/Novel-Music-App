import React, { Component } from 'react';
import * as Tone from 'tone';
import { SequencerTrack } from './SequencerTrack';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Button from '@mui/material/Button';
import AddBox from '@mui/icons-material/AddBox';



export class Sequencer extends Component {

    constructor(props) {
        super(props);

        this._noteMatrix = [];
        this._trackIDs = [];
        this._trackNames = [];

        if (props.savedState) {
            let save = props.savedState;

            save.json.tracks.map(t => {
                this._noteMatrix.push(t.notes);
                this._trackIDs.push(t.id);
                this._trackNames.push(t.name);
            })

            let maxID = Math.max(...this._trackIDs);

            this.state = {
                numSteps: this._noteMatrix[0].length,
                numTracks: this._noteMatrix.length,
                currentStepID: 0,
                lifetimeNumTracks: maxID + 1,
                loading: props.loading

            }
        } else {

            this.state = {
                numSteps: 16,
                numTracks: 4,
                currentStepID: 0,
                lifetimeNumTracks: 4,
                loading: props.loading

            }

        this.callbacks = props.callbacks;

            for (let i = 0; i < this.state.numTracks; i++) {
                let row = [];
                for (let j = 0; j < this.state.numSteps; j++) {
                    row.push(false);
                }
                this._noteMatrix.push(row);
                this._trackIDs.push(i);
                this._trackNames.push("Track " + i);
            }
        }

        this.callback = props.callback;


        

        this._sequencer = new Tone.Sequence(this._tick.bind(this), this._indexArray(this.state.numSteps), '8n');
        Tone.Transport.start();
    }

    _indexArray(count) {
        const indices = [];
        for (let i = 0; i < count; i++) {
            indices.push(i);
        }
        return indices;
    }

    _tick(time, idx) {
        console.log(`time: ${time}, step: ${idx}`)
        let step = idx % this.state.numSteps;
        for (let track = 0; track < this.state.numTracks; track++) {
            if (this._noteMatrix[track][step]) {
                this.callback(this._trackIDs[track]);
            }
        }
        this.setState({ currentStepID: step });
        //this.forceUpdate();
    }

    /**
     * Removes the specified track from the component and from the internal note matrix.
     * Simply copies note matrix and track IDs. This should be called infrequently so efficiency is not important.
     * @param {any} trackID
     */
    _removeTrack(trackID) {
        let newMatrix = [];
        let newTrackIDs = [];
        let newTrackNames = [];

        let trackIndex = this._trackIDs.indexOf(trackID);
        this._noteMatrix.splice(trackIndex, 1);
        this._trackIDs.splice(trackIndex, 1);
        this._trackNames.splice(trackIndex, 1);
        
        //for (let i = 0; i < this.state.numTracks; i++) {
        //    if (this._trackIDs[i] != trackID) { // dont copy the track to be removed
        //        newMatrix.push(this._noteMatrix[i]);
        //        newTrackIDs.push(this._trackIDs[i]);
        //        newTrackNames.push(this._trackNames[i]);
        //    }
        //}

        //this._noteMatrix = newMatrix;
        //this._trackIDs = newTrackIDs;
        //this._trackNames = newTrackNames;

        this.setState({numTracks: this.state.numTracks - 1});
    }

    removeTrack = this._removeTrack.bind(this);

    /**
     * Adds a single track. The new track will have a blank row in the note matrix and the next highest available trackID.
     */
    _addTrack() {
        let row = [...Array(this.state.numSteps)].map((_, i) => { return false; });
        this._noteMatrix.push(row);
        this._trackIDs.push(this.state.lifetimeNumTracks + 1);
        this._trackNames.push("Track " + this.state.lifetimeNumTracks);
        this.setState({
            lifetimeNumTracks: this.state.lifetimeNumTracks + 1,
            numTracks: this.state.numTracks + 1
        });

    }

    addTrack = this._addTrack.bind(this);

    toggleNote(trackID, step) {
        let trackIdx = this._trackIDs.indexOf(trackID);
        this._noteMatrix[trackIdx][step] = !this._noteMatrix[trackIdx][step];
        if (this._noteMatrix[trackIdx][step]) {
            this.callback(trackID);
        }
    }

    

    _startSequence() {
        Tone.start();
        if (this._sequencer.state !== 'started') {
            this._sequencer.start(0);
        }
        Tone.Transport.start();
    }

    _stopSequence() {
        //Tone.Transport.stop();
        Tone.Transport.pause();
        //this._sequencer.stop(0);
    }


    render() {

        if (this.props.loading) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            );
        }


        let tracks = this._trackIDs.map((id, i) => {
            return (
                <SequencerTrack
                    key={i}
                    trackID={id}
                    currentStepID={this.state.currentStepID}
                    title={this._trackNames[i]}
                    noteCount={this.state.numSteps}
                    onNotes={this._noteMatrix[i]}
                    toggleNote={this.toggleNote.bind(this)}
                    removeTrack={this.removeTrack}
                />
            )
        })

        return (
            <div className="row">
                <div className="col-2">
                    <button onClick={this._startSequence.bind(this)}>Play</button>
                    <button onClick={this._stopSequence.bind(this)}>Pause</button>
                </div>
                <div className="col-auto">
                    {tracks}
                </div>
                <Button endIcon={<AddBoxIcon />} onClick={this.addTrack}>
                    Add Track
                </Button>
                
               
                
                <div></div>
            </div>
        );

    }
}

// Trying to copy the Tone.js demo...a bit too complicated for now
/*
export class Sequencer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            matrix: [],
            columns: 16,
            rows: 4,
            subdivision: "8n",
            _matrix:[[true, true], [true, true]],
            highlighted: -1,
            started: false
        }
        this._sequencer = new Tone.Sequence(this._tick.bind(this), this._indexArray(this.state.columns), this.state.subdivision).start(0);
    }

    update(changed) {
        if (changed.has("columns") || changed.has("subdivision")) {
            if (this._sequencer) {
                this._sequencer.dispose();
            }
            this._sequencer = new Tone.Sequence(this._tick.bind(this), this._indexArray(this.state.columns), this.state.subdivision).start(0);
        }
        if (changed.has("columns") || changed.has("rows")) {
            this.setState({
                _matrix: this._indexArray(this.columns).map(() => {
                    return this._indexArray(this.rows).map(() => false)
                })
            });
        }
        super.update(changed);
    }

    _indexArray(count) {
        const indices = [];
        for (let i = 0; i < count; i++) {
            indices.push(i);
        }
        return indices;
    }

    _tick(time, index) {
        Tone.Draw.schedule(() => {
            if (this.started) {
                this.highlighted = index;
            }
        }, time);
        this._matrix[index].forEach((value, row) => {
            if (value) {
                row = this.rows - row - 1;
                this.dispatchEvent(new CustomEvent("trigger", {
                    detail: {
                        time,
                        row,
                    },
                    composed: true,
                }));
            }
        });
    }

    _updateCell(column, row) {

        this._matrix[column][row] = !this._matrix[column][row];
    }

    _mouseover(e, column, row) {
        if (e.buttons) {
            this._updateCell(column, row);
        }
    }

    render() {
        let cols = this.state.matrix.map((column, x) =>
            <div class="column" highlighted={x === this.highlighted}>
                {column.map((cell, y) =>
                    <button onMouseOver={e => this._mouseover(e, x, y)} class="cell" filled={cell}></button>)
                }
            </div>
        )

        return (
            <div>
                <h1>Sequencer</h1>
                {cols}
            </div >
        );
    }
}
*/

// Original Tone.js example

//    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
//    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
//    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
//    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
//    return c > 3 && r && Object.defineProperty(target, key, r), r;
//};

//Object.defineProperty(exports, "__esModule", { value: true });
//exports.ToneStepSequencer = void 0;
//const lit_element_1 = __webpack_require__(/*! lit-element */ "./node_modules/lit-element/lit-element.js");
//const Tone = __webpack_require__(/*! tone */ "tone"); \nconst style = __webpack_require__(/*! ./step-sequencer.scss */ "./src/components/input/step-sequencer.scss");


//let ToneStepSequencer = class ToneStepSequencer extends lit_element_1.LitElement {
//    constructor() {
//        super(...arguments);
//        this.columns = 16;
//        this.rows = 4;
//        this.subdivision = "8n";
//        this._matrix = [];
//        this.highlighted = -1;
//        this.started = false;
//    }
//    update(changed) {
//        if (changed.has("columns") || changed.has("subdivision")) {
//            if (this._sequencer) {
//                this._sequencer.dispose();
//            }
//            this._sequencer = new Tone.Sequence(this._tick.bind(this), this._indexArray(this.columns), this.subdivision).start(0);
//        }
//        if (changed.has("columns") || changed.has("rows")) {
//            this._matrix = this._indexArray(this.columns).map(() => {
//                return this._indexArray(this.rows).map(() => false);
//            });
//        }
//        super.update(changed);
//    }
//    firstUpdated(props) {
//        super.firstUpdated(props);
//        Tone.Transport.on("start", () => this.started = true);
//        Tone.Transport.on("stop", () => {
//            this.highlighted = -1;
//            this.started = false;
//        });
//    }
//    updated(changed) {
//        super.updated(changed);
//        if (changed.has("rows")) {
//            const width = this._container.offsetWidth;
//            const cellWidth = width / this.columns;
//            this._container.style.height = `${cellWidth * this.rows}px`;
//        }
//    }
//    _indexArray(count) {
//        const indices = [];
//        for (let i = 0; i < count; i++) {
//            indices.push(i);
//        }
//        return indices;
//    }
//    _tick(time, index) {
//        Tone.Draw.schedule(() => {
//            if (this.started) {
//                this.highlighted = index;
//            }
//        }, time);
//        this._matrix[index].forEach((value, row) => {
//            if (value) {
//                row = this.rows - row - 1;
//                this.dispatchEvent(new CustomEvent("trigger", {
//                    detail: {
//                        time,
//                        row,
//                    },
//                    composed: true,
//                }));
//            }
//        });
//    }
//    static get styles() {
//        return lit_element_1.css`${lit_element_1.unsafeCSS(style)}`;
//    }
//    _updateCell(column, row) {
//        this._matrix[column][row] = !this._matrix[column][row];
//        this.requestUpdate();
//    }
//    _mouseover(e, column, row) {
//        if (e.buttons) {
//            this._updateCell(column, row);
//        }

//    }
//    render() {

//        return lit_element_1.html`\n\t\t\t<div id="container">${this._matrix.map((column, x) => lit_element_1.html`\n\t\t\t\t<div class="column" ?highlighted=${x === this.highlighted}>\n\t\t\t\t\t${column.map((cell, y) => lit_element_1.html`\n\t\t\t\t\t\t<button \n\t\t\t\t\t\t\t@mouseover=${e => this._mouseover(e, x, y)}\n\t\t\t\t\t\t\t@mousedown=${e => this._mouseover(e, x, y)}\n\t\t\t\t\t\t\tclass="cell" ?filled=${cell}></button>\n\t\t\t\t\t`)}\n\t\t\t\t</div>\n\t\t\t`)}</div>\n\t\t`;
//    }
//};
