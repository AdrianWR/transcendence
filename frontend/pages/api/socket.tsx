/* import { Server } from "socket.io";

const positions = {};

const SocketHandler = (req, res) => {
    // It means that socket server was already initialised
    if (res.socket.server.io) {
        console.log("Already set up");
        res.end();
        return;
    }

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
        console.log(`${socket.id} connected.`)

        //lets add a starting position when the client connects
        positions[socket.id] = { x: 0.5, y: 0.5 };

        socket.on("disconnect", () => {
            //when this client disconnects, lets delete its position from the object.
            delete positions[socket.id];
            console.log(`${socket.id} disconnected`);
        });

        //client can send a message 'updatePosition' each time the clients position changes
        socket.on("updatePosition", (data) => {
            positions[socket.id].x = data.x;
            positions[socket.id].y = data.y;
        });
    })


    console.log("Setting up socket");
    res.end();


    const frameRate = 30;
    setInterval(() => {
        io.emit("positions", positions);
    }, 1000 / frameRate);
}



export default SocketHandler */

import type { NextApiRequest, NextApiResponse } from 'next'

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ name: 'Socket!' })
}