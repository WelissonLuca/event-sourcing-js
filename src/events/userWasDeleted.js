const Event = require('../lib/event')


module.exports = class UserWasDeleted extends Event { 
  static eventName = 'userWasDeleted'


  constructor(data) {
    super(UserWasDeleted.eventName, data);
    Object.defineProperty(this, 'eventName', {
      writable: false,
      configurable: false,
      enumerable: true,
    })
  }

  static commit(state, event) { 
    state.deletedAt = event.data.timestamp;
    state.updatedAt = event.data.timestamp;

    return state;
  }
}