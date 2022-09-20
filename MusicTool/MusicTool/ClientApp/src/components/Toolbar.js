import './Toolbar.css';
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


export default function Toolbar(props) {
    const [value, setValue] = React.useState('select');

    const handleChange = (event) => {
        props.onChange(event.target.value);
        //this.value = event.target.value;
        setValue(event.target.value);
    };

    return (
        <FormControl>
            <FormLabel id="toolbar-radio-buttons-group-label">Tool</FormLabel>
            <RadioGroup
                row
                aria-labelledby="toolbar-radio-buttons-group-label"
                name="toolbar-radio-buttons-group"
                value={props.value}
                onChange={handleChange}
            >
                <FormControlLabel value="select" control={<Radio />} label="Select" />
                <FormControlLabel value="cannon" control={<Radio />} label="Cannon" />
                <FormControlLabel value="drum" control={<Radio />} label="Drum" />
                <FormControlLabel value="cymbal" control={<Radio />} label="Cymbal" />
                <FormControlLabel value="cowbell" control={<Radio />} label="Cowbell" />
            </RadioGroup>
        </FormControl>
    );
}