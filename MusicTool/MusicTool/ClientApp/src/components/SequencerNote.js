import classNames from 'classnames';
import './SequencerNote.css';


export const SequencerNote = ({
    trackID,
    stepID,
    isNoteOn,
    isNoteOnCurrentStep,
    toggleNote
}) => {

    const noteClassNames = classNames('sequencer-note', {
        'on': isNoteOn,
        'playing': isNoteOn && isNoteOnCurrentStep,
        'skipped': (!isNoteOn) && isNoteOnCurrentStep
    })

    const noteClicked = e => {
        e.target.classList.toggle('on')
        toggleNote(trackID, stepID)
    }

    return (
        <div
            className={noteClassNames}
            onClick={noteClicked}
        />
    )
}
