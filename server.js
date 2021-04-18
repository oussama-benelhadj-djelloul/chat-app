const express = require('express');
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const port = process.env.PORT || 3000;
const formatmsg = require('./util/message');
const { userjoin, getnowuser, userout, usersofroom } = require('./util/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

//Run when client connect
io.on('connection', socket => {
    socket.on('joinroom', ({ username, room }) => {
        const user = userjoin(socket.id, username, room);
        socket.join(user.room);
        //Weloming users
        socket.emit('message', formatmsg('Djouss Bot', username + ' Welcome to My Chat Board'));
        console.log('Hello Socket in Fire!!!');
        //new user connect
        socket.broadcast.to(user.room).emit('message', formatmsg('OussamaBot', username + ' has Join'));
        //lesiten to chat
        socket.on('chatmsg', msg => {
            console.log(msg);
            //get the user
            const user = getnowuser(socket.id);
            //.to is to strickt the room of the user
            io.to(user.room).emit('message', formatmsg(user.username, msg))
        })
        //users of the room
        io.to(user.room).emit('roomInfo', {
            users: usersofroom(user.room),
        })
        socket.on('disconnect', () => {
            const user = userout(socket.id);
            //send a lsg
            if (user) {
                io.to(user.room).to(user.room).emit('message', formatmsg('OussamaBot', user.username + ' has left'));
                //users of the room
                io.emit('roomInfo', {
                    users: usersofroom(user.room),
                })
            }
        })

    })
    //disocnnect a user
    //get the username
})


server.listen(port);