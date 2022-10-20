import { SequencerNote } from './SequencerNote';
import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import './SequencerTrack.css'


export class SequencerTrack extends Component {
    constructor(props) {
        super(props)

        this.state = {
            trackName: props.trackName
        }
        this.changeTrackName = this._changeTrackName.bind(this);
    }

    generateNotes() {
        let notes = [...Array(this.props.noteCount)].map((el, i) => {
            const isNoteOn = this.props.onNotes[i];
            const isNoteOnCurrentStep = this.props.currentStepID === i
            const stepID = i

            return (
                <SequencerNote
                    key={i}
                    trackID={this.props.trackID}
                    stepID={stepID}
                    isNoteOn={isNoteOn}
                    isNoteOnCurrentStep={isNoteOnCurrentStep}
                    toggleNote={this.props.toggleNote}
                />
            )
        })

        return notes;
    }

    _changeTrackName(trackID, name) {
        console.log("Changing track name");

        this.setState({
            trackName: name
        })
        this.props.changeTrackName(trackID, name);
    }

    render() {

        let notes = this.generateNotes();

        return (
            <div className="sequencer-track">
                <div className="track_title">{this.props.trackName}</div>

                <main className="track_notes">
                    {notes}
                </main>
            </div>
        )
    }
}

