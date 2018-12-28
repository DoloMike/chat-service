const mockMessageData = [
	{ content: 'a message', author: 'an author', createdAt: 'a date string' },
	{ content: 'a second message', author: 'another author', createdAt: 'another date string' }
];

const redisMock = {
	lpushAsync: async (messagesKey, msgJson) => {
		return 1;
	},
	lrangeAsync: async (messagesKey, startIndex, stopIndex) => {
		return mockMessageData.map((m) => JSON.stringify(m));
	}
};

const messageController = require('../../controllers/messageController')(redisMock);

describe('message controller', () => {
	test('it returns an array of message objects', async (done) => {
		const messages = await messageController.getMessages('key', 0, 0);
		expect(messages).toEqual(mockMessageData.reverse());
		done();
	});

	test('it appends a new message', async (done) => {
		const res = await messageController.appendMessage(1, mockMessageData[0]);
		expect(res).toBeTruthy();
		done();
	});
});
