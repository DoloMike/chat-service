const roomController = (redis) => {
	const roomsKey = `rooms`;

	return {
		/**
		 * @description Add a new chat room
		 * @param {{id: string, name: string}} room The room being added
		 * @returns {boolean} True on successful save to redis, False on failure
		 */
		addNewRoom: async (room) => {
			const res = await redis.rpushAsync(roomsKey, JSON.stringify(room));
			return res > 0;
		},

		/**
		 * @description Get all message rooms		 
		 * @returns {Array.<{roomName: string, roomId: string}>} Array of room objects
		 */
		getRooms: async () => {
			const rooms = await redis.lrangeAsync(roomsKey, 0, -1);
			return rooms.map((m) => JSON.parse(m));
		}
	};
};

module.exports = roomController;
