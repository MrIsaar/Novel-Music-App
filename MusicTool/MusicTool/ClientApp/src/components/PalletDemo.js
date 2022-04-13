import React, { Component } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./DragDrop";

import './Picture.css'

// Hint: cd ClientApp before using npm to instore react-dnd

export class PalletDemo extends Component {
    getImageXY = (items) => {
        // {picture id, drop position to the left of board, drop position to the top of board}
        // get e.g. [{pictureid1, x, y}, {pictureid2, x, y}, {pictureid3, x, y}]
        // implement cannon ...
        console.log(items[0].id);
        console.log(items[0].toLeft);
        console.log(items[0].toTop);
    }
    render() {
        return (
            <DndProvider backend={HTML5Backend}>
                <div className="PalletDemo">
                    <DragDrop onImageXY={this.getImageXY }  />
                </div>
            </DndProvider>
        );
    }
}
