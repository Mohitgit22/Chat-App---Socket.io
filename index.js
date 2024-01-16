const express = require('express');
const app = express();

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);


const connect = require('./config/database-config');



io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('msg_send', (data) => {
        console.log(data);
        io.emit('msg_rcvd', data);
        //socket.emit('msg_rcvd', data);
    });
});

app.use('/', express.static(__dirname + '/public'));

server.listen(3000, async () => {
    console.log('Server started');
    await connect();
    console.log("mongodb connected");
});