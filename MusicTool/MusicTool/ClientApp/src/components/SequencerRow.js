import React, { Component } from 'react';
//import Checkbox from '@mui/material/Checkbox';
//import $ from 'jquery';
import Checkbox from '@mui/material/Checkbox';


export class SequencerRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cols: 16
        }
    }

    render() {
        let row = [];
        for (let i = 0; i < this.state.cols; i++) {
            row.push(<Checkbox onChange={(e) => this.props.callback(e, this.props.row, i)}/>);
        }


        return (
            <div>{row}</div>
        );

    }
}
