const roomModel = (async () => {
	// Get mongo db connection string
	const { db_user, db_pass, db_url } = process.env;
	const connectionStr = `mongodb://${db_user}:${db_pass}@${db_url}`;

	// Connect to mongo and define room model
	const mongoose = require('mongoose');
	const conn = await mongoose.createConnection(connectionStr, { useNewUrlParser: true });
	const roomSchema = new mongoose.Schema({
		name: String,
		messages: Array
	});
	return conn.model('room', roomSchema);
})();

// Functions to perform CRUD on chat rooms
const roomController = {
	/**
	 * Returns a room json document
	 * @param {string} id - The id of the room to get
	 */
	async getRoom(id) {
		try {
			let room = await roomModel.findById({ id });
			return res.json(room);
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
	async listRooms() {
		try {
			let rooms = await roomModel.find({}, 'name');
			return res.json(rooms);
		} catch (err) {
			return res.status(500).json({
				message: 'Error when getting chat rooms',
				error: err
			});
		}
	}
};

module.exports = roomController;
