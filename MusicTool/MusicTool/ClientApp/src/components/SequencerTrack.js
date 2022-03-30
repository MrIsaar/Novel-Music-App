import { SequencerNote } from './SequencerNote';
import './SequencerTrack.css'



export const SequencerTrack = ({
    channelID,
    currentStepID,
    title,
    noteCount,
    onNotes,
    toggleNote
}) => {

    const notes = [...Array(noteCount)].map((el, i) => {
        const isNoteOn = onNotes[i];
        const isNoteOnCurrentStep = currentStepID === i
        const stepID = i

        return (
            <SequencerNote
                key={i}
                channelID={channelID}
                stepID={stepID}
                isNoteOn={isNoteOn}
                isNoteOnCurrentStep={isNoteOnCurrentStep}
                toggleNote={toggleNote}
            />
        )
    })

    return (
        <div className="sequencer-track">
            <header className="track_title">{title}</header>
            <main className="track_notes">
                {notes}
            </main>
        </div>
    )
}

