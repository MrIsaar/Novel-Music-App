import { SequencerNote } from './SequencerNote';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import './SequencerTrack.css'



export const SequencerTrack = ({
    trackID,
    currentStepID,
    title,
    noteCount,
    onNotes,
    toggleNote,
    removeTrack,
    selected,
    onSelect
}) => {
     
    const notes = [...Array(noteCount)].map((el, i) => {
        const isNoteOn = onNotes[i];
        const isNoteOnCurrentStep = currentStepID === i
        const stepID = i

        return (
            <SequencerNote
                key={i}
                trackID={trackID}
                stepID={stepID}
                isNoteOn={isNoteOn}
                isNoteOnCurrentStep={isNoteOnCurrentStep}
                toggleNote={toggleNote}
            />
        )
    })

    return (
        <div className={`sequencer-track ${selected ? "text-primary" : ""}`} onClick={onSelect}>
            <header className="track_title">{title}</header>
            <main className="track_notes">
                {notes}
            </main>
            <IconButton aria-label="delete" color="primary" onClick={(e) => { removeTrack(trackID); e.stopPropagation(); }}>
                <DeleteIcon />
            </IconButton>
        </div>
    )
}

