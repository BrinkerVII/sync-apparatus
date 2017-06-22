function EventThing() {
	this.register = {}
}

EventThing.prototype.on = function(event, callback) {
	if (!this.register[event]) {
		this.register[event] = [];
	}

	this.register[event].push(callback);

	return {
		disconnect: () => {
			this.disconnectCallback(event, callback);
		}
	}
}

EventThing.prototype.call = function(event, param0, param1) {
	if (!this.register.hasOwnProperty(event)) {
		return;
	}

	this.register[event].forEach(f => {
		f(param0, param1);
	});
}

EventThing.prototype.disconnectCallback = function(event, callback) {
	if (!this.register[event]) {
		return;
	}
	let index = -1;

	for (var i = 0; i < this.register[event].length; i++) {
		if (this.register[event][i] === callback) {
			index = i;
			break;
		}
	}

	if (index >= 0) {
		this.register[event].splice(index);
		this.disconnectCallback(event, callback);
	}
}

module.exports = EventThing;
