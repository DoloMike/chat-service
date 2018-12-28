const rooms = 'rooms';
const messages = 'messages';

const roomController = (redis) => {
	return {
		/**
		 * @description Adds a new message to a given room
		 * @param {number} roomId The id of the chat room to add the message
		 * @param {{content: string, author: string, createdAt: string}} msg The message being appended
		 * @returns {boolean} True on successful save to redis, False on failure
		 */
		appendMessage: async (roomId, msg) => {
			const messagesKey = `${rooms}:${roomId}:${messages}`;
			const res = await redis.lpushAsync(messagesKey, JSON.stringify(msg));
			return res > 0;
		},

		/**
		 * @description Gets n amount of the most recent messages for a given room, skipping the first m messages
		 * @param {number} roomId The id of the chat room to fetch messages from
		 * @param {number} messageCount The amount of messages to fetch
		 * @param {number} skip The amount of messages to skip. Assuming order by most recent.
		 * @returns {Array.<{content: string, author: string, createdAt: string}>} Array of msg objects
		 */
		getMessages: async (roomId, messageCount, skip) => {
			const messagesKey = `${rooms}:${roomId}:${messages}`;
			const msgs = await redis.lrangeAsync(messagesKey, skip, messageCount + skip);
			return msgs.map((m) => JSON.parse(m)).reverse();
		}

		// /**
		//  * Returns a room json document
		//  * @param {string} id - The id of the room to get
		//  */
		// getRoom: async (id) => {
		// 	try {
		// 		return await redis.findById(id);
		// 	} catch (err) {
		// 		return res.status(500).json({
		// 			message: `Error when getting chat room ${id}`,
		// 			error: err
		// 		});
		// 	}
		// },

		// /**
		//  * Returns the id and name of all chat rooms
		//  */
		// listRooms: async () => {
		// 	try {
		// 		return await redis.find({}, 'name');
		// 	} catch (err) {
		// 		return res.status(500).json({
		// 			message: 'Error when getting chat rooms',
		// 			error: err
		// 		});
		// 	}
		// },

		// /**
		//  * Returns the id and name of all chat rooms
		//  */
		// addRoom: async (roomName) => {
		// 	const room = {
		// 		roomName: roomName,
		// 		messages: []
		// 	};

		// 	try {
		// 		return await room.save();
		// 	} catch (err) {
		// 		return res.status(500).json({
		// 			message: `Error when getting chat room ${room.roomName}`,
		// 			error: err
		// 		});
		// 	}
		// }
	};
};

module.exports = roomController;
