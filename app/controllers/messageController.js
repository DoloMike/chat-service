const messageController = (redis) => {
	const getMessagesKey = (roomId) => `rooms:${roomId}:messages`;

	return {
		/**
		 * @description Adds a new message to a given room
		 * @param {number} roomId The id of the chat room to add the message
		 * @param {{content: string, author: string, createdAt: string}} msg The message being appended
		 * @returns {boolean} True on successful save to redis, False on failure
		 */
		appendMessage: async (roomId, msg) => {
			const messagesKey = getMessagesKey(roomId);
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
			const messagesKey = getMessagesKey(roomId);
			const msgs = await redis.lrangeAsync(messagesKey, skip, messageCount + skip);
			return msgs.map((m) => JSON.parse(m)).reverse();
		}
	};
};

module.exports = messageController;
