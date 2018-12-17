const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
	name: String,
	messages: Array
});

module.exports = mongoose.model('room', roomSchema);
