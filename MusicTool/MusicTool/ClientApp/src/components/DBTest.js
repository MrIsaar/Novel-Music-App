import React, { Component } from 'react';


export class DBTest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: "",
            projectID: 1
        };
    }

    componentDidMount() {
        this.getProject();
    }

    
    render() {
        return (
            <div className="db-test">
                <h1>DB Test</h1>
                <textarea value={this.state.projectID} onChange={v => this.setState({ projectID: v })}></textarea>
                <button onClick={this.getProject}>Get Project</button>
                <div>{this.state.project}</div>
            </div>
        )
    }

    getProject(id) {
        fetch('/projects/' + this.state.projectID)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({
                    project: JSON.stringify(data)
                })
            })
            .catch(err => console.log(err));

        //const response = await fetch('weatherforecast');
        //const data = await response.json();
        //this.setState({ forecasts: data, loading: false });
    }
}

