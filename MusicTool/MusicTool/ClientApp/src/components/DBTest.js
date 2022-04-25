import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export class DBTest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            creations: [{
                name: '',
                creationID: '',
                creationDate: '',
                lastEditDate: '',
                creationObjectCount: ''
            }]
        };

        this._getCreations = this.getCreations.bind(this);

    }

    componentDidMount() {
       this.getCreations();
    }

    render() {
        return (
            <div className="db-test">
                <h1>DB Test</h1>
                <button onClick={this._getCreations}>Get Project</button>
                <div>{this.state.project}</div>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">ID</TableCell>
                                <TableCell align="right">Created</TableCell>
                                <TableCell align="right">Last Edited</TableCell>
                                <TableCell align="right">Object Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.creations.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.creationID}</TableCell>
                                    <TableCell align="right">{row.creationDate}</TableCell>
                                    <TableCell align="right">{row.lastEditDate}</TableCell>
                                    <TableCell align="right">{row.creationObjectCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }

    getCreations() {
        fetch('/api/Creations/summaries')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({
                    creations: data
                })
            })
            .catch(err => console.log(err));

        //const response = await fetch('weatherforecast');
        //const data = await response.json();
        //this.setState({ forecasts: data, loading: false });
    }
}

