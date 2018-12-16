// Define room schema and get the roomModel
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roomSchema = new Schema({
	name: String,
	messages: Array
});
const roomModel = mongoose.model('room', roomSchema);

/**
 * Functions to perform CRUD on chat rooms
 */
module.exports = {
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
