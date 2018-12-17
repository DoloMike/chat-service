const roomController = (roomModel) => {
	return {
		/**
		 * Returns a room json document
		 * @param {string} id - The id of the room to get
		 */
		getRoom: async (id) => {
			try {
				return await roomModel.findById(id);
			} catch (err) {
				return res.status(500).json({
					message: `Error when getting chat room ${id}`,
					error: err
				});
			}
		},

		/**
		 * Returns the id and name of all chat rooms
		 */
		listRooms: async () => {
			try {
				return await roomModel.find({}, 'name');
			} catch (err) {
				return res.status(500).json({
					message: 'Error when getting chat rooms',
					error: err
				});
			}
		},

		/**
		 * Returns the id and name of all chat rooms
		 */
		addRoom: async (roomName) => {
			const room = new roomModel({
				roomName: roomName,
				messages: []
			});

			try {
				return await room.save();
			} catch (err) {
				return res.status(500).json({
					message: `Error when getting chat room ${room.roomName}`,
					error: err
				});
			}
		}
	};
};

module.exports = roomController;
