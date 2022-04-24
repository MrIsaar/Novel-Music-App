import React, { Component } from 'react';


export class DBTest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: "",
            projectID: 1
        };
        
        this._getProject = this.getProject.bind(this);

    }


    
    render() {
        return (
            <div className="db-test">
                <h1>DB Test</h1>
                <textarea onChange={v => this.setState({ projectID: parseInt(v.target.value) })}></textarea>
                <button onClick={this._getProject}>Get Project</button>
                <div>{this.state.project}</div>
            </div>
        )
    }

    getProject() {
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

