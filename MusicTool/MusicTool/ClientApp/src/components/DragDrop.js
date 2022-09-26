import Picture from "./Picture";
import { Component, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { Scene } from "./Scene";
import Overlay from 'react-bootstrap/Overlay';


let imageClickPos = {};
let oldIndex = -1;

const findParent = (element, idName) => {
    if (!element) {
        return null;
    }
    //|| element.id === idName
    if (element.constructor.name ==='HTMLCanvasElement' ) {
        return element;
    }
    //console.log('element.parent:', element.parentElement)
    return findParent(element.parentElement, idName)
}

// Drop picture hook
const DivDrop = (props) => {
     const [{ isOver }, drop] = useDrop(() => ({
            accept: "image",
         drop: (item, a, b) => {
                // drop position on this window
                const { offsetX: x, offsetY: y } = window.event;
                // Handle image overlaps
             console.log('target', window.event.target.constructor.name);
             if (window.event.target.id !== 'Board') {
                 const fp = findParent(window.event.target, '_Scene');
                 
                 if (!fp) {
                     return;
                 }
             }
                // Add this image to board
                props.addImageToBoard(item.id, { x, y })
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
     }));

    // Automatically executed each time a picture is dropped
    useEffect(() => {
        if (drop) {
            props.onDrop(drop)
        }
    }, [drop])

    // Pass value to render function in DragDrop class
    return <div>{props.children}</div>
}

export default class DragDrop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drop:'',
            board: [],
            PictureList: [
                { id: 1, path: './PalletImages/1.png' },
                { id: 2, path: './PalletImages/2.png' },
                { id: 3, path: './PalletImages/3.png' },
                { id: 4, path: './PalletImages/4.png' },
                { id: 5, path: './PalletImages/5.png' },
                { id: 6, path: './PalletImages/6.png' },
            ]
        }
    }

    addImageToBoard = (id, info) => {
        // board: drawing canvas
        // PictureList: a list of pictures showing outside board
        const { board, PictureList } = this.state;
        // imageDrop state to return: [{imgId_1, xPosOnBoard, yPosOnBoard}, {imgId_2, xPosOnBoard, yPosOnBoard}, {imgId_3, xPosOnBoard, yPosOnBoard}]
        const { onImageXY } = this.props;
        // a list store pictures based on needed id
        const pictureList = PictureList.filter((picture) => id === picture.id);
        // get x, y position on board
        const { diffX = 0, diffY = 0 } = imageClickPos;
        const x = info.x - diffX;
        const y = info.y - diffY;
        // a copy of current board
        const tmpBoard = [...board];

        // modify images show on the board
        if (oldIndex != -1) {
            /*// handle images that already exit on board: move to new place and delete old place
            const findIndex = tmpBoard.findIndex((p) => p._id === oldIndex);
            // get position information of old place
            const tb = tmpBoard.find((p) => p._id === oldIndex)
            tb.info = { x, y };*/
        } else {
            // add new image to board
            tmpBoard.push({ ...pictureList[0], _id: Math.random(), info: { x, y } });
        }

        // refresh board and old palce image index tracking
        this.setState({ board: tmpBoard });
        oldIndex = -1;

        // get and set return state
        const ImageXYItems = tmpBoard.map((p) => ({ id: p.id, toLeft: p.info.x, toTop: p.info.y }))
        onImageXY && onImageXY(ImageXYItems);
    };

    render() {
        const { board = [], PictureList = [], drop } = this.state;
    
        return (
            <DivDrop
                addImageToBoard={(id, info) => {
                    this.addImageToBoard(id, info)
                }}
                onDrop={(e) => {
                this.setState({drop:e})
                }}>

                <div id="Board" className="Board" ref={drop}>
                    <div className="Scene"  >
                        <Scene/>
                    </div>
                    {
                        board.map((picture, key) => {
                            const style = {};
                            const {  x,y } = picture.info || {}
                            if (y) {
                                style.position = 'absolute';
                                style.top = `${y}px`;
                                style.left = `${x}px`;
                            }
                         
                            /*return <div key={key} style={style}>
                                <Picture path={picture.path} id={picture.id} diffMouse={() => {
                                    oldIndex = picture._id;
                                    this.setState({ oldIndex: picture._id })
                                }} />
                            </div>;*/
                        })
                    }
                </div>
               
                <div className="Pictures">
                    {
                        PictureList.map((picture, key) => {
                            return <Picture key={key} path={picture.path} id={picture.id}
                                diffMouse={(vals) => {
                                    oldIndex = -1;
                                    const tmp = [...PictureList]
                                    tmp[key] = { ...picture,vals }
                                    imageClickPos = vals;
                                    //setPictureList(tmp)
                                    this.setState({ PictureList:tmp})

                                }}
                            />;
                        })
                    }
                </div>

            </DivDrop>
        );
    }
}

