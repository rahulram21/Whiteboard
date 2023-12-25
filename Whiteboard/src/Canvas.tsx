import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, {useEffect, useRef} from "react";
import io, { Socket } from 'socket.io-client';

interface MyBoard{
    brushColor : string;
    brushSize : number;
}

const Board: React.FC<MyBoard>= (props) => {
    
    const {brushColor, brushSize} = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    //const [socket, setSocket] = useState(null);
    let newSocket: Socket<DefaultEventsMap, DefaultEventsMap>;

    useEffect(()=>{
        newSocket = io('http://localhost:5000');
        console.log(newSocket, "connected to socket");
        //setSocket(newSocket);
    },[]);
    //Draw
    useEffect(()=>{
        if(newSocket){
            //event listener for receiveing canvas data from the socket
            newSocket.on('canvasImage', (data)=>{
                //create an image object from the data URL
                const image = new Image();
                image.src = data;

                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                image.onload = () => {
                    ctx?.drawImage(image, 0, 0);
                }
            })
        }
    })
    useEffect (()=>{
        //variables to store drawing params
        let isDrawing =  false;
        let lastx = 0;
        let lasty = 0;

        //start drawing
        const startDrawing = (e:{offsetX : number; offsetY : number;}) => {
            isDrawing = true;
            [lastx , lasty] = [e.offsetX, e.offsetY];
        };

        //function to draw
        const draw = (e: {offsetX : number; offsetY : number;}) => {

            if(!isDrawing) return;

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            
            if(ctx){
                ctx?.beginPath();
                ctx?.moveTo(lastx, lasty);
                ctx?.lineTo(e.offsetX, e.offsetY);
                ctx?.stroke();
            }
            [lastx, lasty] = [e.offsetX, e.offsetY];

        };

        //end drawing
        const endDrawing = ()=>{
            const canvas = canvasRef.current;
            const dataURL = canvas?.toDataURL();

            if(newSocket){
                newSocket.emit('canvasImage', dataURL);
                console.log("Drawing ended");
            }
            isDrawing = false;
        };

        const canvas : HTMLCanvasElement | null = canvasRef.current;
        //const ctx = canvasRef.current?.getContext('2d'); //replace canvasref.current with just canvas after rendering and check if there are errors
        const ctx = canvas?.getContext('2d');

        if(ctx){
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }

        canvas?.addEventListener('mousedown', startDrawing);
        canvas?.addEventListener('mouseup', endDrawing);
        canvas?.addEventListener('mousemove', draw);
        canvas?.addEventListener('mouseout', endDrawing);

        return() => {
            canvas?.removeEventListener('mousedown', startDrawing);
            canvas?.removeEventListener('mouseup', endDrawing);
            canvas?.removeEventListener('mousemove', draw);
            canvas?.removeEventListener('mouseout', endDrawing);
        }


    },[brushColor, brushSize, /*socket*/])

    return(
        //create a canvas
        <canvas
            ref = {canvasRef}
            width = {1200}
            height={700}
            style={{backgroundColor : "white"}}
            />
    )
}

export default Board;