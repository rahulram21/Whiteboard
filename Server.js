
const {server} = require('socket.io');
const io = new server({
    cors: "http://localhost:5173/"
})
io.on('connection', (socket) => {
    socket.on('canvasImage', (data) => {
        socket.broadcast.emit('canvasImage', data);
    })
})

io.listen(5000);