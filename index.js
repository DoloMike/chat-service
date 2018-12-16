const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.port || 3000;
const roomApi = require('./roomApi');

io.origins('*:*'); // allow cors

io.on('connection', async (socket) => {
	// get list of chat rooms to join
	console.log('a user connected');
	const rooms = await roomApi.getRooms();
	socket.emit('gotRooms', rooms);

	// client can only join one chat room at a time
	let previousRoomId;
	const safeJoin = (currentRoomId) => {
		socket.leave(previousRoomId);
		socket.join(currentRoomId);
		previousRoomId = currentRoomId;
	};

	// get the full room document
	socket.on('joinRoom', async (roomId) => {
		safeJoin(roomId);
		room = await roomApi.getRoom(roomId);
		socket.emit('room', room);
	});

	// disconnect
	socket.on('disconnect', (socket) => {
		socket.leave(previousRoomId);
		console.log('user disconnected');
	});
});

// start server
http.listen(port, () => {
	console.log(`listening on *:${port}`);
});
