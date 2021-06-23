let app = require('express'); 
let server = require('http').createServer(app);
let io = require('socket.io')(server, {
    origins: ["*"],
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

let port = 47000;

server.listen(port, () => {
    console.log('listening on ' + port);
})


io.on('connection', (socket) => { 
    
    const user_id = +socket.handshake.query.id;

    if (user_id) {
        
        socket.join(user_id);
        socket.join(JSON.parse(socket.handshake.query.chats));
        socket.emit('connection', user_id);

    }
    
    socket.on('send-message', ({ id, message }) => {
        socket.broadcast.to(+id).emit('receive-message', message);
    })
    
    socket.on('set-typing', ({ id, name, typing }) => {
        socket.broadcast.to(+id).emit('receive-typing', { name, typing });
    })

    socket.on('read-by', ({ id, read_by }) => {
        socket.broadcast.to(+id).emit('receive-read-by', { id, read_by });
    })
});