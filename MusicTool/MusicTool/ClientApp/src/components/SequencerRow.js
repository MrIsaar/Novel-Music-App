import React, { Component } from 'react';


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
            row.push(<input type="checkbox" onClick={() => this.props.callback(this.props.row, i)}/>);
        }


        return (
            <div>{row}</div>
        );

    }
}
