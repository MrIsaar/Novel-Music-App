import React from "react";
import http from "../httpFetch";
import Scene from "./Scene.js";
import Toolbar from "./Toolbar.js";
import { Sequencer } from "./Sequencer.js";
import ToneExample from "./ToneSetup"

export class MTClient extends React.Component {
    scene;
    creationID;

    constructor(props) {
        super(props);

        this.setSelectedTool = this.setSelectedTool.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.saveObjectsToDB = this.saveObjectsToDB.bind(this);

        this.state = {
            loading: true,
            sequencerData: {},
            selectedTool: 'select'
        };

        let { creationID } = this.props.match.params;
        this.creationID = creationID;
        this.scene = new Scene({
            objectAdded: () => this.setSelectedTool("select")
        });

        this.creationFromDB = null;
    }

    setSelectedTool(tool) {
        this.setState({ selectedTool: tool });
        this.scene.selectedTool = tool;
        console.log(`Selected Tool: ${tool}`)
    }

    componentDidMount() {
        if (this.creationID) {
            this.loadCreation();
        }

        // Once creation is loaded, add everything to the scene

        document.querySelector("#scene").appendChild(this.scene.app.view);
    }

    render() {
        let callback = this.scene.fireBalls;
        //let callback = this.fireBalls;

        let sequencer;
        if (this.state.loading) {
            sequencer = <h1>Loading...</h1>;
        } else {
            sequencer =
                <Sequencer
                    savedState={this.sequencerSavedState}
                    loading={this.state.loading}
                    callback={callback}
                />
        }

        return (
            <div id="_Scene" >
                <Toolbar
                    onChange={this.setSelectedTool.bind(this)}
                    value={this.state.selectedTool}
                ></Toolbar>
                <div ref="scene" id="scene" />
                <div className="row">
                    <div className="col-3"><ToneExample /> </div>
                    <div className="col-3">
                        <button onClick={this.scene.fireBalls}>------FIRE------</button>
                        <button onClick={this.handleSave}>------SAVE------</button>
                        <button onClick={this.saveObjectsToDB}>------SAVE-Object------</button>
                    </div>

                </div>
                <p>alt click to create a cannon, shift click to fire.<br />
                    click to select cannons to move or rotate</p>
                {sequencer}
            </div>
        );
    }

    loadCreation() {
        fetch('/api/Creations/' + this.creationID)
            //fetch('/api/Creations/' + 1)
            .then(res => res.json())
            .then(data => {
                console.log("creation data: ", data);
                console.log("object list: ", data.creationObject);
                for (let i = 0; i < data.creationObject.length; i++) {
                    console.log(`DB obj Saved cannon ${i}: `, data.creationObject[i]);
                    console.log(`DB Saved MTObj cannon ${i}: `, data.creationObject[i].json);
                    console.log(`DB Saved MTObj.type cannon ${i}: `, data.creationObject[i].json.MTObjType);
                    console.log(`DB Saved MTObj.position cannon ${i}: `, data.creationObject[i].json.position);
                    console.log(`DB Saved MTObj.angle cannon ${i}: `, data.creationObject[i].json.angle);
                    this.scene.loadObject(data.creationObject[i].creationObjectID, data.creationObject[i].json);
                }
                this.creationFromDB = data;
                this.sequencerSavedState = data.sequencer;
                this.setState({
                    loading: false,
                    sequencerData: data.sequencer
                });

                //this.loadObjects(data.creationObject);
            });
    }

    handleSave = async () => {
        let CreationID = this.creationID;
        let UserID = http.getUserId();
        let AccessLevel = 2;
        let Creation = this.creationFromDB;

        try {
            // Should store access before creation!
            // save access
            const res = await http.post('/access/save/' + CreationID, { data: { CreationID, UserID: `${UserID}`, AccessLevel, Creation } })
            // TODO: other db save post here are samples for saving creation, creationobject and sequencer
            // CHECK Postman for more details on JSON_string <- MUST be in type of string

            // save creations
            // e.g.string JSON = "name": "TestCreation3","worldRules": {"gravity": 1,"background": "blue"},"creationDate": .... ...., "creationID": 3
            // await http.post('/creations/save/' + CreationID, { data: { CreationID, JSON_string })

            // e.g. string JSON = "json": {"tracks": [{"name": "track1","notes": [true,true,true,false,false,false]},{"name": "track2","notes": [true,false,false,true,false,false]}]},"creationID": 2
            // await http.post('/sequencer/save/' + CreationID, { data: { CreationID, JSON_string} })

            // e.g. string JSON = "json": {"type": "drum","x": 0,"y": 0,"radius": 10,"color": "green"},"type": "drum","creationID": 4
            // json = '{ "MTObjType": "Cannon", "MTObjVersion": "1.0.0","objectNumber":"2", "position": { "x": 300, "y": 150 }, "angle": 2, "image": null, "shape": [ { "x": -20, "y": -10 }, { "x": 70, "y": 0 }, { "x": -20, "y": 10 }, { "x": -40, "y": 0 } ], "collisionFilter": { "group": 0, "category": 0, "mask": 0 }, "fireLayer": 1, "power": 20, "marbleSize": 20, "marbleColor": "rand", "marbleCollisionFilter": { "group": -1, "category": 4294967295, "mask": 4294967295 } }';

            console.log(res);
            console.log('save access successful');
        } catch (ex) {
            console.log(ex)
        }

        // .then((res) => {
        //     console.log(res);
        //     console.log('save access successful');
        // }).catch((ex) => {
        //     console.log('not successful')
        // })
    }

    saveObjectsToDB = async () => {
        let CreationID = this.creationID;
        let UserID = http.getUserId();
        let AccessLevel = 2;
        let Creation = this.creationFromDB;
        let allObjectsToSave = this.saveCreation();
        for (let i = 0; i < allObjectsToSave.length; i++) {
            /*if (allObjectsToSave[i].objectNumber > 0)
                continue; //TODO: REMOVE TO ENABLE ALL SAVE*/
            try {
                let json = allObjectsToSave[i].saveObject();
                /*json.shape = [{ "x": -20, "y": -10 }, { "x": 70, "y": 0 }, { "x": -20, "y": 10 }, { "x": -40, "y": 0 }];
                json.angle = 2;
                json.objectNumber = 10;
                json.position = { "x": 300, "y": 150 };*/

                let MTObjType = json.MTObjType;
                let Id = json.objectNumber;
                let creationObj = {};
                //console.log(creationObj);
                creationObj.creationObjectID = undefined;
                creationObj.type = MTObjType;
                creationObj.json = json;
                creationObj.creationID = CreationID;
                //console.log(creationObj);
                const saveRes = await http.post('/creationObject/save/' + CreationID, { data: creationObj });
                // store object id in json so next time it is synced
                if (saveRes.creationObjectID != Id) {
                    allObjectsToSave[i].objectNumber = saveRes.creationObjectID;
                }

                console.log(saveRes);

            } catch (ex) {
                console.log(ex)
            }
        }
    }
}