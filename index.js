const express = require('express');
const app = express();

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);


const connect = require('./config/database-config');
const Chat = require('./models/chat');


// backend---> basically server side
io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        console.log("joining a room", data.roomid);
        socket.join(data.roomid);
    })

    socket.on('msg_send', async (data) => {
        console.log(data);
        const chat = await Chat.create({
            roomId: data.roomid,
            user: data.username,
            content: data.msg
        })
        io.to(data.roomid).emit('msg_rcvd', data);
    });

     // server shows "someone is typing" when in actual in that chat room some person in typing after receving from index.ejs file
    socket.on('typing', (data) => {
        socket.broadcast.to(data.roomid).emit('someone_typing');
    })
});

app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

app.get('/chat/:roomid', async (req, res) => {
     const chats = await Chat.find({
        roomId: req.params.roomid
     }).select('content user');//to display the content

    res.render('index', {
        name: 'Mohit',
        id: req.params.roomid,
        chats: chats
    });
})

server.listen(3000, async () => {
    console.log('Server started');
    await connect();
    console.log("mongodb connected");
});