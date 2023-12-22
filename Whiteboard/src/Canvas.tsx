import React, {useEffect, useRef} from "react";

const Board = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    //Draw
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
            isDrawing = false;
        };

        const canvas : HTMLCanvasElement | null = canvasRef.current;
        //const ctx = canvasRef.current?.getContext('2d'); //replace canvasref.current with just canvas after rendering and check if there are errors
        const ctx = canvas?.getContext('2d');

        if(ctx){
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 5;
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


    })

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