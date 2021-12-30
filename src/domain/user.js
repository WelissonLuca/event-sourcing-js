const Reducer = require("../lib/reducer");
const UserWasCreated = require("../events/userWasCreated");
const UserWasDeleted = require("../events/userWasDeleted");
const UserWasUpdated = require("../events/userWasUpdated");
const hash = require("../lib/hasher");

module.exports = class User {
	id = null;

	name = null;

	email = null;

	password = null;

	createdAt = null;

	updatedAt = null;

	deletedAt = null;

	static collection = "users";

	#reducer = null;

	#pendingEvents = [];

	#persistedEvents = [];

	constructor(persistedEvents = []) {
		this.#reducer = new Reducer({
			[UserWasCreated.eventName]: UserWasCreated.commit,
			[UserWasDeleted.eventName]: UserWasDeleted.commit,
			[UserWasUpdated.eventName]: UserWasUpdated.commit,
		});
		if (persistedEvents.length > 0) {
			this.#persistedEvents = persistedEvents;
			this.#updateInternalState();
		}
	}

	#updateInternalState = () => {
		const state = this.state;

		for (const propertyName of Object.keys(state)) {
			this[propertyName] = state[propertyName];
		}
	};

	pushEvents(events = []) {
		this.#pendingEvents = this.#pendingEvents.concat(events);
		this.#updateInternalState();
		return this;
	}

	confirmEvents() {
		this.#persistedEvents = this.#persistedEvents.concat(this.#pendingEvents);
		this.#pendingEvents = [];
		return this;
	}

	get events() {
		return [...this.#persistedEvents, ...this.#pendingEvents];
	}

	set event(value) {
		this.#persistedEvents = value;
		this.#updateInternalState();
	}

	get state() {
		const currentState = this.#reducer.reduce(new User(), this.events);

		return { ...currentState };
	}

	static create(creationParams = null) {
		if (!"name" in creationParams || !"email" in creationParams) {
			throw new Error("Missing required parameters");
		}

		const user = new User();

		user.pushEvents([
			new UserWasCreated({
				...creationParams,
				id: hash(creationParams.email),
			}),
		]);

		return user;
	}

	delete() {
		this.pushEvents([new UserWasDeleted()]);

		return this;
	}

	update(data) {
		this.pushEvents([new UserWasUpdated(data)]);

		return this;
	}
};
