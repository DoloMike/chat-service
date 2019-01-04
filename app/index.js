// load .env values from this projects root directory
require('dotenv').config({
	path: require('path').join(__dirname, '../.env')
});
// const port = process.env.port || 3001;
const { port = 3001, redis_connection_uri } = process.env;

// get redis connection
const redis = require('redis').createClient(redis_connection_uri);
redis.on('error', (err) => {
	console.log(err);
});
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

// require dependencies and our chatroom controller
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const roomController = require('./controllers/roomController')(redis);
const messageController = require('./controllers/messageController')(redis);

// allow cors and define WS events
io.origins('*:*');
io.on('connection', async (socket) => {
	// get list of chat rooms to join
	console.log('a user connected');
	// const rooms = await roomController.getRooms();
	// socket.emit('gotRooms', rooms);

	// client can only join one chat room at a time
	let previousRoomId;
	const safeJoin = (currentRoomId) => {
		socket.leave(previousRoomId);
		socket.join(currentRoomId);
		previousRoomId = currentRoomId;
	};

	// upon joining a room, load the most recent messages.
	// TODO: implement join_room event for initial load
	socket.on('requesting_messages', async (roomId, msgCount = 19, skip = 0) => {
		const msgs = await messageController.getMessages(roomId, msgCount, skip);
		socket.emit('loaded_messages', msgs);
	});

	socket.on('new_message', async (roomId, msg) => {
		res = await messageController.appendMessage(roomId, msg);
		if (res) {
			io.emit('new_message_broadcast', msg);
		}
	});

	// // get the full room document
	// socket.on('joinRoom', async (roomId) => {
	// 	safeJoin(roomId);
	// 	console.log('joinRoomCalled')
	// 	room = await roomController.getRoom(roomId);
	// 	socket.emit('room', room);
	// });

	// // add a new chat room
	// socket.on('addRoom', async (roomName) => {
	// 	room = await roomController.addRoom(roomName);
	// 	socket.emit('room', room);
	// });

	// disconnect
	socket.on('disconnect', (socket) => {
		// socket.leave(previousRoomId);
		console.log('user disconnected');
	});
});

// start server once connected to redis
redis.on('connect', () => {
	http.listen(port, () => {
		const host = http.address().address === '::' ? 'localhost' : `[${http.address().address}]`;
		console.log(`listening on http://${host}:${port}`);
	});
	module.exports = http; // for e2e testing)
});
