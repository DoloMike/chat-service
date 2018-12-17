const roomModel = require('../../models/roomModel');
const roomController = require('../../controllers/roomController');

describe('room controller', () => {
	const mockRoomData = { 1: { name: 'room1' }, 2: { name: 'room2' } };

	test('it returns a list of rooms', async (done) => {
		// mock Model.find()
		const RoomFindMock = jest.spyOn(roomModel, 'find');
		const RoomFind = jest.fn((query, fields, obj) => {
			return Promise.resolve(mockRoomData);
		});
		RoomFindMock.mockImplementation(RoomFind);

		const roomsResult = await roomController(roomModel).listRooms();
		expect(roomsResult).toEqual(mockRoomData);
		done();
	});

	test('it returns a room by id', async (done) => {
		// mock Model.findById()
		const RoomFindByIdMock = jest.spyOn(roomModel, 'findById');
		const RoomFindById = jest.fn((id) => {
			return Promise.resolve(mockRoomData[id]);
		});
		RoomFindByIdMock.mockImplementation(RoomFindById);

		const roomId = 1;
		const roomsResult = await roomController(roomModel).getRoom(roomId);
		expect(roomsResult).toEqual(mockRoomData[roomId]);
		done();
	});

	test('it can save a new room', async (done) => {
		// mock Model.save()
		const room = { name: 'room1' };
		const RoomSaveMock = jest.spyOn(roomModel.prototype, 'save');
		const RoomSave = jest.fn(() => {
			return Promise.resolve(room);
		});
		RoomSaveMock.mockImplementation(RoomSave);

		const roomResult = await roomController(roomModel).addRoom(room.name);
		expect(roomResult).toEqual(room);
		done();
	});
});
