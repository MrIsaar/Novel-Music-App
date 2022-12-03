import React, { Component } from 'react';

/*
 * props = {
       selection: {
           selected: {
               position = {x, y},
               angle/rotation,
               power,
               fireOn // selectedTrackID
            }
       },
       tracks: [{name, id}]
 * }
 */
class CannonMenu extends Component {
    constructor(props) {
        super(props);
    }

    // <select>.value returns value of selected option
    render() {
        const s = this.props.selection;
        const c = s.selected;

        const options = this.props.tracks.map((track) => {
            if (track.id === c.fireOn)
                return (<option key={track.id} value={track.id} selected>{track.name}</option>);
            else
                return (<option key={track.id} value={track.id}>{track.name}</option>);
        });

        const xChange = (e) => s.updateBodyPosition(parseFloat(e.target.value), c.position.y);
        const yChange = (e) => s.updateBodyPosition(c.position.x, parseFloat(e.target.value));
        const angleChange = (e) => s.updateBodyAngle(parseFloat(e.target.value) * (Math.PI / 180));
        const powerChange = (e) => s.updateSelectedParam("power", parseFloat(e.target.value));
        const trackChange = (e) => s.updateSelectedParam("fireOn", parseInt(e.target.value));

        return (
            <div>
                <form onKeyUp={(e) => e.stopPropagation()}>
                    <label for="cannon-x">X:</label>
                    <input type="number" id="cannon-x" name="cannon-x" value={c.position.x} onChange={xChange}></input>
                    <label for="cannon-y">Y:</label>
                    <input type="number" id="cannon-y" name="cannon-y" value={c.position.y} onChange={yChange}></input>
                    <label for="cannon-angle">Angle:</label>
                    <input type="number" id="cannon-angle" name="cannon-angle" value={c.angle} onChange={angleChange}></input>
                    <label for="cannon-power">Power:</label>
                    <input type="number" id="cannon-power" name="cannon-power" value={c.power} onChange={powerChange}></input>
                    <label for="cannon-track">Track:</label>
                    <select id="cannon-track" name="cannon-track" onChange={trackChange}>
                        {options}
                    </select>
                </form>
            </div>
        );
    }
}

export default CannonMenu;