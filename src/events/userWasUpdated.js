const Event = require('../lib/event')


module.exports = class UserWasUpdated extends Event {
	static eventName = "userWasUpdated";

	constructor(data) {
		super(UserWasUpdated.eventName, data);
		Object.defineProperty(this, "eventName", {
			writable: false,
			configurable: false,
			enumerable: true,
		});
	}

	static commit(state, event) {
    state.name = event.data.name ?? state.name;
    state.email = event.data.email ?? state.email;
    state.password = event.data.password ?? state.password;
		state.updatedAt = event.data.timestamp;

		return state;
	}
};