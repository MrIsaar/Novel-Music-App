import React from "react";
import http from "../httpFetch";
import Scene from "./Scene.js";
import Toolbar from "./Toolbar.js";
import { Sequencer } from "./Sequencer.js";
import ToneExample from "./ToneSetup"
import Matter, { Engine, World, Mouse, MouseConstraint } from "matter-js";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export class MTClient extends React.Component {
    scene;
    creationID;

    constructor(props) {
        super(props);

        this.setSelectedTool = this.setSelectedTool.bind(this);
        this.setSelectedTrack = this.setSelectedTrack.bind(this);
        this.saveObjectsToDB = this.saveObjectsToDB.bind(this);

        this.state = {
            loading: true,
            sequencerData: {},
            selectedTool: 'select',
            selectedTrack: null,
            showReminderBox_CannotSave: false
        };

        let { creationID } = this.props.match.params;
        this.creationID = creationID;
        this.scene = new Scene({
            objectAdded: () => this.setSelectedTool("select")
        });
        this.sequencer = null

        this.creationFromDB = null;
    }

    setSelectedTool(tool) {
        this.setState({ selectedTool: tool });
        this.scene.selectedTool = tool;
        console.log(`Selected Tool: ${tool}`)
    }

    setSelectedTrack(trackID = -1) {
        this.setState({ selectedTrack: trackID });
        this.scene.selectedTrack = trackID;
    }

    setShowReminderBox_CannotSave = (showReminderBox_CannotSave) => {
        this.setState({ showReminderBox_CannotSave })
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

        
        if (this.state.loading) {
            this.sequencer = <h1>Loading...</h1>;
        } else {
            this.sequencer =
                <Sequencer
                    savedState={this.sequencerSavedState}
                    loading={this.state.loading}
                    callback={callback}
                    selectedTrack={this.state.selectedTrack}
                    onSelectedTrackChange={this.setSelectedTrack}
                />
        }

        return (
            <div id="_Scene" tabIndex={0} onKeyUp={this.onKeyDown}>
                <Toolbar
                    onChange={this.setSelectedTool.bind(this)}
                    value={this.state.selectedTool}
                ></Toolbar>
                <div id="instrumentSettings">
                    <label for="notes">Choose a note:</label>

                    <select name="notes" id="notes">
                        <option value="C2">C2</option>
                        <option value="D2">D2</option>
                        <option value="E2">E2</option>
                        <option value="F2">F2</option>
                        <option value="G2">G2</option>
                        <option value="G#2">G#2</option>
                        <option value="A2">A2</option>
                        <option value="A#2">A#2</option>
                        <option value="B2">B2</option>
                        <option value="C3">C3</option>
                        <option value="D3">D3</option>
                        <option value="E3">E3</option>
                        <option value="F3">F3</option>
                        <option value="G3">G3</option>
                        <option value="A3">A3</option>
                        <option value="B3">B3</option>
                        <option value="C4">C4</option>
                        <option value="D4">D4</option>
                        <option value="E4">E4</option>
                        <option value="F4">F4</option>
                        <option value="G4">G4</option>
                        <option value="A4">A4</option>
                        <option value="B4">B4</option>
                    </select>
                </div>
                <div ref="scene" id="scene" />
                <div className="row">
            

                    
                    <div className="col">
                        {this.sequencer}
                    </div>
                    <div className="col-3">


                        <Button variant="primary" onClick={this.handleSave} id="saveToDBButton">SAVE-CREATION</Button>

                        <br></br>
                        <br></br>

                        <Button variant="primary" onClick={() => { this.deleteObject(this.scene.selection != null ? this.scene.selection.selected : null); }} id="deleteToDBButton" >DELETE-OBJECT</Button>
                        <div >
                           
                            <div id="cannonSettings">
                                <label for="power" id="powerlabel">Cannon power:</label>
                                <br />
                                <input type="range" id="power" name="power" min="1" max="25" step="1" defaultValue="1" onMouseMove={() => {
                                    if (this.scene.selection != null && this.scene.selection.selected.MTObjType == "Cannon") {
                                        let power = document.getElementById('power').value;

                                        this.scene.selection.selected.updatePower(power);

                                    }
                                }} />

                            </div>
                        </div>



                        <Modal show={this.state.showReminderBox_CannotSave} onHide={this.handleCloseReminderBox_CannotSave}>
                            <Modal.Header closeButton>
                                <Modal.Title>Reminder</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Sorry, you are not the owner of this project, so you do not have permission to modify it.
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={this.handleCloseReminderBox_CannotSave}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div className="col-3">
                        <div>
                            <label for="gX" id="gXlabel">gravity X: 0</label>
                            <br />
                            <input type="range" id="gX" name="gX" min="-2" max="2" step="0.25" defaultValue="0" onMouseMove={() => { let x = document.getElementById('gX').value; let y = document.getElementById('gY').value; document.getElementById('gXlabel').innerHTML = `gravity X: ${x}`; this.scene.updateGravity(y, x) }} />
                        </div>
                        <div>
                            <label for="gY" id="gYlabel">gravity Y: 1</label>
                            <br />
                            <input type="range" id="gY" name="gY" min="-2" max="2" step="0.25" defaultValue="1" onMouseMove={() => { let x = document.getElementById('gX').value; let y = document.getElementById('gY').value; document.getElementById('gYlabel').innerHTML = `gravity Y: ${y}`; this.scene.updateGravity(y, x) }} />

                        </div>
                        

                    </div>

                </div>
                
                

                
            </div>
        );
    }

    /**
     * triggers if any key is down
     * used to delete via the keyboard
     * @param {any} event
     */
    onKeyDown = (event) => {
        if (event.key == 'Backspace' || event.key == 'Delete') {
            this.deleteObject(this.scene.selection != null ? this.scene.selection.selected : null);

        }
        else if (event.key == 'c' && event.ctrlKey) {
            console.log("copy selected");
            if (this.scene.selection != null) {
                let copy = this.scene.selection.selected;
                console.log(copy);
                this.scene.copiedObject = copy;
            }
            else {
                console.log("Nothing selected");
            }

        }
        else if (event.key == 'v' && event.ctrlKey) {
            console.log("paste selected");
            if (this.scene.copiedObject != null) {
                let pasteObj = this.scene.copiedObject.saveObject();
                console.log(pasteObj);
                pasteObj.objectNumber = -1;
                pasteObj.position.x += 20;
                pasteObj.position.y += 20;
                this.scene.loadObject(this.creationObjectID, pasteObj);
            }
            else {
                console.log("Nothing to copy");
            }
        }
        else if (event.key == 'a' || event.key == 'b') {

            console.log("you pressed a or b")
        }
        else {
            console.log("you pressed a keyboard button")
        }
        document.getElementById("_Scene").blur();
    }


    updateControls() {
        document.getElementById('gX').value = this.scene.getGravity().x;
        document.getElementById('gY').value = this.scene.getGravity().y;
        let x = document.getElementById('gX').value;
        let y = document.getElementById('gY').value;
        document.getElementById('gXlabel').innerHTML = `gravity X: ${x}`;
        document.getElementById('gYlabel').innerHTML = `gravity Y: ${y}`;

        if (this.scene.selection != null && this.scene.selection.selected.MTObjType == "Cannon") {
            document.getElementById('power').value = this.scene.selection.selected.power;
        }
        else
            document.getElementById('power').value = 1;
        let power = document.getElementById('power').value;
        
    }
    


    loadCreation() {
        fetch('/api/Creations/' + this.creationID)
            //fetch('/api/Creations/' + 1)
            .then(res => res.json())
            .then(data => {
                console.log("creation data: ", data);
                
                this.scene.updateGravity(data.worldRules.gravity.y, data.worldRules.gravity.x);
                this.updateControls();
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
        this.loadCreation();
        let Creation = this.creationFromDB;
        let isOwner = false;

        let savebutton = document.getElementById("saveToDBButton");
        let deletebutton = document.getElementById("deleteToDBButton");
        savebutton.disabled = true;
        deletebutton.disabled = true;

        // check whether current user is the owner of project
        if (UserID != null) {
            let list = http.getProjectList();
            // check if creationID is contained
            list.map(({ id, name }) => {
                // check if creationID is contained
                if (`${id}` == `${CreationID}`) {
                    isOwner = true;
                }
            })
        }

        if (isOwner) {
            try {
                // Should store access before creation!
                // save access
                //const res = await http.post('/access/save/' + CreationID, { data: { CreationID, UserID: `${UserID}`, AccessLevel, Creation } })
                // TODO: other db save post here are samples for saving creation, creationobject and sequencer
                // CHECK Postman for more details on JSON_string <- MUST be in type of string

                // save creations
                // e.g.string JSON = "name": "TestCreation3","worldRules": {"gravity": 1,"background": "blue"},"creationDate": .... ...., "creationID": 3
                Creation.worldRules = { gravity: this.scene.getGravity()};
                Creation.sequencer = this.sequencerSavedState;
                Creation.sequencer.sequencerID = undefined;// DB controller doesnt like if it is defined
                const res = await http.post('/creations/save/' + CreationID, { data: Creation });

                // e.g. string JSON = "json": {"tracks": [{"name": "track1","notes": [true,true,true,false,false,false]},{"name": "track2","notes": [true,false,false,true,false,false]}]},"creationID": 2
                // await http.post('/sequencer/save/' + CreationID, { data: { CreationID, JSON_string} })

                // e.g. string JSON = "json": {"type": "drum","x": 0,"y": 0,"radius": 10,"color": "green"},"type": "drum","creationID": 4
                // json = '{ "MTObjType": "Cannon", "MTObjVersion": "1.0.0","objectNumber":"2", "position": { "x": 300, "y": 150 }, "angle": 2, "image": null, "shape": [ { "x": -20, "y": -10 }, { "x": 70, "y": 0 }, { "x": -20, "y": 10 }, { "x": -40, "y": 0 } ], "collisionFilter": { "group": 0, "category": 0, "mask": 0 }, "fireLayer": 1, "power": 20, "marbleSize": 20, "marbleColor": "rand", "marbleCollisionFilter": { "group": -1, "category": 4294967295, "mask": 4294967295 } }';

                console.log(res);

                console.log('save access successful');
                this.saveObjectsToDB();

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
        else {
            this.handleShowReminderBox_CannotSave();
        }
        savebutton.disabled = false;
        deletebutton.disabled = false;
    }


    saveObjectsToDB = async () => {
        let CreationID = this.creationID;
        let UserID = http.getUserId();
        let AccessLevel = 2;
        let isOwner = false;
        

        // check whether current user is the owner of project
        if (UserID != null) {
            let list = http.getProjectList();
            // check if creationID is contained
            list.map(({ id, name }) => {
                // check if creationID is contained
                if (`${id}` == `${CreationID}`) {
                    isOwner = true;
                }
            })
        }

        if (isOwner) {
            // save access
            let CreationID_str = CreationID + "";
            let UserID_str = UserID + "";
            let access = { "creationID": CreationID_str, "userID": UserID_str, "accessLevel": AccessLevel };
            const res = await http.post('/Access/save/' + CreationID, { data: access })
            console.log('save access successful ');
            console.log(res);

            //let Creation = this.creationFromDB;
            let allObjectsToSave = this.scene.getAllObjects(CreationID);

            //disable buttons        
           


            const saveRes = await http.post('/creationObject/save/' + CreationID, { data: allObjectsToSave });
            // store object id in json so next time it is synced
            if (saveRes.length !== allObjectsToSave.length) {
                console.log("Something went wrong with saving");

            }

            for (let i = 0; i < saveRes.length; i++) {
                if (allObjectsToSave[i].json.objectNumber !== saveRes[i].creationObjectID && allObjectsToSave[i].type === saveRes[i].type) {
                    if (i < this.scene.cannons.length) {
                        this.scene.cannons[i].creationObjectID = saveRes[i].creationObjectID;
                    }
                    else if (i < this.scene.cannons.length + this.scene.drums.length) {
                        this.scene.drums[i - this.scene.cannons.length].creationObjectID = saveRes[i].creationObjectID;
                    }

                }
            }

            console.log(`succesfully saved: `);
            console.log(saveRes);
            console.log(this.sequencer);
            console.log(this.sequencer.props);
            try {
                let sequencerObj = this.sequencerSavedState;
                // update sequencer based on web local storage
                this.updateSequencerObj(sequencerObj);
                sequencerObj.sequencerID = undefined;// DB controller doesnt like if it is defined
                let saveRes = await http.post('/sequencer/save/' + CreationID, { data: sequencerObj });
                console.log(`succesfully saved sequencer`);
                console.log(saveRes);
            } catch (ex) {
                console.log(ex)
            } finally {
                // enable button
                
            }
        }
        else {
            this.handleShowReminderBox_CannotSave();
        }

    }

    updateSequencerObj(sequencerObj) {
        let names = http.getTrackNames();
        let matrix = http.getSequencerMatrix();
        let len = matrix.length;

        if (names == null) {
            names = [];
            for (let i = 0; i < len; i++) {
                names[i] = "track" + (i + 1);
            }
        }
        else {
            for (let i = 0; i < len; i++) {
                if (names[i] == null)
                    names[i] = "track" + (i + 1);
            }
        }

        for (let i = 0; i < len; i++) {
            sequencerObj.json.tracks[i] = { name: names[i], id: i + 1, notes: matrix[i] };
        }

        // console.log(sequencerObj.json.tracks);
    }

    // handle the close/show pop-up box
    handleCloseReminderBox_CannotSave = () => this.setShowReminderBox_CannotSave(false);
    handleShowReminderBox_CannotSave = () => this.setShowReminderBox_CannotSave(true);

    /**
     * removes object from known cannon, ball, or instrument lists
     * returns true if object deleted
     *         false if object not found
     */
    deleteObject = (object) => {
        let UserID = http.getUserId();
        let CreationID = this.creationID;
        let isOwner = false;

        // check whether current user is the owner of project
        if (UserID != null) {
            let list = http.getProjectList();
            // check if creationID is contained
            list.map(({ id, name }) => {
                // check if creationID is contained
                if (`${id}` == `${CreationID}`) {
                    isOwner = true;
                }
            })
        }

        if (isOwner) {
            // selected if the
            //remove with delete
            //remove with backspace
            //remove by drag out of bounds
            if (object == null) {
                console.log("nothing selected, nothing deleted");
                return;
            }
            if (object.MTObjType === "Ball") {

                //short circut because it is the most common deletion
                // always delete oldest ball
                object = this.scene.balls.shift();
                Matter.World.remove(this.engine.world, object.body);
                object.destroy({ children: true });
                return;

            }
            let index = -1;

            try {
                if (object.MTObjType === "Cannon") {
                    index = this.scene.cannons.indexOf(object);
                    if (object.objectNumber <= 0) {
                        this.scene.cannons.pop(index);
                    }
                    else {
                        http.delete('/creationobject/' + object.objectNumber, { data: this.creationID })
                            .then((res) => {
                                this.scene.cannons.pop(index);
                                console.log("cannon deleting");
                            });
                    }
                } else if (object.MTObjType === "Instrument") {
                    index = this.scene.drums.indexOf(object);
                    if (object.objectNumber <= 0) {
                        this.scene.drums.pop(index);
                    }
                    else {
                        http.delete('/creationobject/' + object.objectNumber, { data: this.creationID })
                            .then((res) => {
                                this.scene.drums.pop(index);
                                console.log("drum deleting");

                            });
                    }
                } else {
                    console.log("something is wrong");
                }

                if (this.scene.selection != null) {
                    this.scene.selection.destroy({ children: true });
                    this.scene.selection = null;
                }
                /* index = this.engine.world.bodies.indexOf(object.body)
                 this.engine.world.bodies.pop(index)*/
                Matter.World.remove(this.scene.engine.world, object.body);
                object.destroy({ children: true });
                //console.log("object removed");
            }
            catch (ex) {
                console.log("could not delete object");
                console.log(ex);
            }

        }
        else {
            this.handleShowReminderBox_CannotSave();
        }
    }
}