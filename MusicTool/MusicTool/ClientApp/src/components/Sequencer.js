import React, { Component } from 'react';
import * as Tone from 'tone';
import { SequencerRow } from './SequencerRow';


export class Sequencer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cols: 16,
            rows: 4
        }

        this._matrix = [];
        for (let i = 0; i < this.state.rows; i++) {
            let row = [];
            for (let j = 0; j < this.state.cols; j++) {
                row.push(false);
            }
            this._matrix.push(row);
        }

        //Tone.start();
        this.instruments = [];
        for (let i = 0; i < this.state.rows; i++) {
            this.instruments.push(new Tone.Synth());
            this.instruments[i].toDestination();
        }
        this.notes = ['C4', 'G3', 'E3', 'C3'];
        this._sequencer = new Tone.Sequence(this._tick.bind(this), this._indexArray(this.state.cols), '8n');
        //this._sequencer.start(0);
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
        console.log(`time: ${time}, idx: ${idx}`)
        let step = idx % this.state.cols;
        for (let i = 0; i < this.state.rows; i++) {
            if (this._matrix[i][step]) {
                this.instruments[i].triggerAttackRelease(this.notes[i], '8n', time);
            }
        }


    }

    _startSequence() {
        Tone.start();
        this._sequencer.start(0);
    }

    _stopSequence() {
        this._sequencer.stop(0);
    }

    checkChanged(event, row, col) {
        console.log(`Check (${row}, ${col}) changed`);
        this._matrix[row][col] = event.target.checked;
    }

    render() {

        let buttons = [];
        for (let i = 0; i < this.state.rows; i++) {
            buttons.push(<div>
                <SequencerRow row={i} callback={this.checkChanged.bind(this)}></SequencerRow>
            </div>);
        }

        return (
            <div>
                <h1>Sequencer</h1>
                <button onClick={this._startSequence.bind(this)}>Play</button>
                <button onClick={this._stopSequence.bind(this)}>Pause</button>
                <div>{buttons}</div>
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
