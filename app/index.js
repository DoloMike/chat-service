// load .env values from this projects root directory
require('dotenv').config({
	path: require('path').join(__dirname, '../.env')
});
const port = process.env.port || 3000;
const { db_user, db_pass, db_url } = process.env;

// require dependencies and our chatroom controller
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const roomModel = require('./models/roomModel');
const roomController = require('./controllers/roomController')(roomModel);

// allow cors and define WS events
io.origins('*:*');
io.on('connection', async (socket) => {
	// get list of chat rooms to join
	console.log('a user connected');
	const rooms = await roomController.getRooms();
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
		room = await roomController.getRoom(roomId);
		socket.emit('room', room);
	});

	// add a new chat room
	socket.on('addRoom', async (roomName) => {
		room = await roomController.addRoom(roomName);
		socket.emit('room', room);
	});

	// disconnect
	socket.on('disconnect', (socket) => {
		socket.leave(previousRoomId);
		console.log('user disconnected');
	});
});

// start server once connected to mongo
const connectionStr = `mongodb://${db_user}:${db_pass}@${db_url}`;
mongoose.connect(connectionStr, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
	http.listen(port, () => {
		const host = http.address().address === '::' ? 'localhost' : `[${http.address().address}]`;
		console.log(`listening on http://${host}:${port}`);
	});
	module.exports = http; // for e2e testing
});
