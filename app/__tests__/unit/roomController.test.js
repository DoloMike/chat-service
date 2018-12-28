const mockRoomData = [ { id: '1', name: 'a chat room' }, { id: '2', name: 'another chat room' } ];

const redisMock = {
	rpushAsync: async (roomsKey, roomJson) => {
		return 1;
	},
	lrangeAsync: async (roomsKey, startIndex, stopIndex) => {
		return mockRoomData.map((m) => JSON.stringify(m));
	}
};

const roomController = require('../../controllers/roomController')(redisMock);

describe('room controller', () => {
	test('it returns an array of room objects', async (done) => {
		const rooms = await roomController.getRooms('key', 0, 0);
		expect(rooms).toEqual(mockRoomData);
		done();
	});

	test('it adds a new room', async (done) => {
		const res = await roomController.addNewRoom(1, mockRoomData[0]);
		expect(res).toBeTruthy();
		done();
	});
});
