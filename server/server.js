import http from "http"
import app from "./app.js"
import dotenv from "dotenv"
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);



const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
    },
});


io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
