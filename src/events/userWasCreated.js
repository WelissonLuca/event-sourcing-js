const Event = require('../lib/event')


module.exports = class UserWasCreated extends Event { 
  static eventName = 'userWasCreated'


  constructor(data) {
    super(UserWasCreated.eventName, data)
    Object.defineProperty(this, 'eventName', {
      writable: false,
      configurable: false,
      enumerable: true,
    })
  }

  static commit(state, event) { 
    state.id = event.data.id;
    state.name = event.data.name;
    state.email = event.data.email;
    state.password = event.data.password;
    state.createdAt = event.data.timestamp;
    state.updatedAt = event.data.timestamp;

    return state;
  }
}