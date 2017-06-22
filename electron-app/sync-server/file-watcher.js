const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const EventThing = require('../event-thing');
var eventThing = new EventThing();

const TAKE_LIMIT = 9 * Math.pow(10, 6);

var changes = [];
var SYNC_DIR = "";

var node_fs_watcher = null;

const WATCH_OPTIONS = {
	recursive: true
}

function pathToPOSIX(ipath) {
	let spath = ipath.split(path.sep);
	return spath.join("/");
}

function removeChange(change) {
	let slice = -1;
	for (var i = 0; i < changes.length; i++) {
		if (changes[i].filename === change) {
			slice = i;
			break;
		}
	}

	if (slice >= 0) {
		changes.splice(slice);
		removeChange(change);
	}
}

function getExistingChanges() {
	let c = [];
	changes.forEach(v => {
		if (!v.deleted) {
			c.push(v);
		}
	});

	return c;
}

function takeChanges() {
	let running = true;
	let index = [];
	let contents = [];
	let contentLength = 0;

	getExistingChanges().forEach(change => {
		if (!running) {
			return;
		}

		let content = fs.readFileSync(change.filename, "UTF-8");
		if (contentLength + content.length > TAKE_LIMIT) {
			running = false;
			return;
		} else {
			index.push(change.id);
			contents.push(content);
			contentLength += content.length;
		}
	});

	return {
		index: index,
		contents: contents
	}
}

function appendChange(newChange) {
	if (!newChange.endsWith(".lua")) {
		return;
	}

	removeChange(newChange);
	fs.stat(newChange, (err, stat) => {
		let deleted = false;

		if (err) {
			deleted = true;
		}

		let relativePath = pathToPOSIX(path.relative(SYNC_DIR, newChange));
		if (!relativePath.startsWith("/")) {
			relativePath = "/" + relativePath;
		}
		if (stat) {
			if (stat.isFile()) {
				let pathMatch = relativePath.match("(.*)\/(.+)\/(.+)\.lua$");

				if (pathMatch) {
					if (pathMatch[2] && pathMatch[2] === pathMatch[3]) {
						relativePath = `${pathMatch[1]}/${pathMatch[2]}.lua`
					}
				}
			}
		}


		let change = {}

		if (deleted) {
			change = {
				filename: newChange,
				relative: relativePath,
				deleted: deleted,
				id: uuid.v1()
			};
		} else {
			change = {
				filename: newChange,
				relative: relativePath,
				isDirectory: stat.isDirectory(),
				isFile: stat.isFile(),
				deleted: false,
				id: uuid.v1()
			};
		}

		changes.push(change);
	});

}

function indexDirectory(dir, index) {
	if (!index) {
		index = [];
	}

	let stat = fs.statSync(dir);
	if (stat) {
		if (stat.isDirectory()) {
			let children = fs.readdirSync(dir);
			if (typeof children === "object") {
				children.forEach(v => {
					let jp = path.join(dir, v);
					stat = fs.statSync(jp);
					if (stat) {
						if (stat.isDirectory()) {
							indexDirectory(jp, index);
						} else {
							index.push(jp);
						}
					}
				});
			}
		}
	}

	return index;
}

function getStructure(dir, index) {
	if (!index) {
		index = [];
	}

	let stat = fs.statSync(dir);
	if (stat) {
		if (stat.isDirectory()) {
			let trimmedPath = path.relative(SYNC_DIR, dir);
			if (trimmedPath.length > 0) {
				trimmedPath = pathToPOSIX(trimmedPath)
				if (!trimmedPath.startsWith("/")) {
					trimmedPath = "/" + trimmedPath;
				}
				index.push(trimmedPath);
			}
			let children = fs.readdirSync(dir);
			if (typeof children === "object") {
				children.forEach(v => {
					let jp = path.join(dir, v);
					stat = fs.statSync(jp);
					if (stat) {
						if (stat.isDirectory()) {
							getStructure(jp, index);
						}
					}
				});
			}
		}
	}

	return index;
}

function doWatch(watchPath) {
	changes = [];
	if (node_fs_watcher) {
		node_fs_watcher.close();
		node_fs_watcher = null;
	}

	indexDirectory(watchPath).forEach(p => {
		appendChange(p);
	});

	node_fs_watcher = fs.watch(watchPath, WATCH_OPTIONS, (event, filename) => {
		appendChange(path.join(watchPath, filename));
		eventThing.call("filechanges", changes);
	});

	eventThing.call("filechanges", changes);
}

const fileWatcher = {
	init: config => {
		SYNC_DIR = config.SYNC_DIR;
		let stat = fs.stat(config.SYNC_DIR, (err, stat) => {
			if (err) {
				if (err.code !== "ENOENT") {
					throw err;
				}

				fs.mkdirSync(config.SYNC_DIR);
			}

			doWatch(config.SYNC_DIR);
		});
	},
	getChanges: () => {
		return changes;
	},
	getDeletions: () => {
		let del = [];
		changes.forEach(v => {
			if (v.deleted) {
				del.push(v);
			}
		});

		return del;
	},
	changeDirectory: dir => {
		SYNC_DIR = dir;
		doWatch(dir);
	},
	takeChanges: takeChanges,
	on: (event, callback) => {
		return eventThing.on(event, callback);
	},
	getSyncDir: () => {
		return SYNC_DIR;
	},
	countChanges: () => {
		return changes.length;
	},
	getStructure: () => {
		return getStructure(SYNC_DIR);
	},
	resolveChanges: (idChanges) => {
		let counter = 0;

		idChanges.forEach(id => {
			let index = -1;
			for (var i = 0; i < changes.length; i++) {
				if (changes[i].id === id) {
					index = i;
					break;
				}
			}

			if (index >= 0) {
				changes.splice(index);
				counter++;
			}
		});

		return counter;
	},
	refreshProject: () => {
		changes = [];
		indexDirectory(SYNC_DIR).forEach(p => {
			appendChange(p);
		});
	}
}

module.exports = fileWatcher;
