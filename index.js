const express = require('express');
const app = express();

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);


const connect = require('./config/database-config');



io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        console.log("joining a room", data.roomid);
        socket.join(data.roomid);
    })

    socket.on('msg_send', (data) => {
        console.log(data);
        // io.emit('msg_rcvd', data);
        // socket.emit('msg_rcvd', data);
        io.to(data.roomid).emit('msg_rcvd', data);
    });
});

app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

app.get('/chat/:roomid', (req, res) => {
    res.render('index', {
        name: 'Mohit',
        id: req.params.roomid,
    });
})

server.listen(3000, async () => {
    console.log('Server started');
    await connect();
    console.log("mongodb connected");
});