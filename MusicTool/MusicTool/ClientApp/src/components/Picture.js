import React, {useEffect, Component } from 'react';
import { useDrag,} from "react-dnd";

// Picture's drag hook
const DivDrop = (props) => {
    const [{ isDragging }, drag] = useDrag((e) => {
      return  {
            type: "image",
            item: { id: props.id },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }
    })

    // Drag and isDragging state - automatically executed/updated once for each rendering of this picture component
    useEffect(() => {
        if (drag) {
            props.onChange(drag)
        }
    }, [drag])

    useEffect(() => {
        props.onIsDragging(isDragging)
    }, [isDragging])

    // Pass value to render function in Picture class
    return <span>{props.children}</span>
}

export default class Picture extends Component{
    constructor(props) {
        super(props)
        this.state = { isDragging: false, drag:'drag' }
    }

    render() {
        // Path: where picture is stored
        // DiffMose: difference in mouse movement distance
        const { path, diffMouse } = this.props;
        const { isDragging, drag } = this.state;

        return (
            <DivDrop {...this.props}
                onIsDragging={(e) => this.setState({ isDragging: e })}
                onChange={(e) => this.setState({ drag:e}) }>
                <img
                    onMouseDown={(event) => {
                        const { x, y } = event.currentTarget.getClientRects()[0]
                        const { clientX, clientY } = event;
                        const diffX = clientX - x;
                        const diffY = clientY - y;
                        // Get and return diffMouse
                        diffMouse && diffMouse({ diffX, diffY });
                    }}
                    
                    ref={drag}
                    style={{ border: isDragging ? "5px solid pink" : "0px" }}
                    src={path}
                    width="50px"
                    alt="IMG"
                    />
            </DivDrop>
        );
    }

}