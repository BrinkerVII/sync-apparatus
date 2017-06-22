const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const MAPPER_FILENAME = ".mapping.json";
var MAPPER_FILE = MAPPER_FILENAME;

var mapping = [];

function getMapString() {
	return JSON.stringify(mapping);
}

function writeMappingSync(fpath) {
	if (!fpath) {
		fpath = MAPPER_FILE;
	}

	let fd = null;
	try {
		fd = fs.openSync(fpath, "w");
		fs.writeSync(fd, getMapString(), 0, 'UTF-8');
	} catch (e) {
		console.warn(e);
	}

	if (fd) {
		try {
			fs.closeSync(fd);
		} catch (e) {
			console.warn(e);
		}
	}
}

function readMappingSync(fpath) {
	mapping = [];
	if (!fpath) {
		fpath = MAPPER_FILE;
	}

	let fileJSON = [];

	try {
		let fileString = fs.readFileSync(fpath, 'UTF-8');
		fileJSON = JSON.parse(fileString);

		if (typeof fileJSON !== "object") {
			fileJSON = [];
		}
	} catch (e) {
		console.warn("Failed to read project mapping");
		return false;
	}

	mapping = fileJSON;
}

function initMapperFile(fpath) {
	let stat = null;
	try {
		stat = fs.statSync(fpath);
	} catch (e) {
		console.warn(e);
	}

	if (!stat) {
		writeMappingSync(fpath);
	}

	stat = null;
	try {
		stat = fs.statSync(fpath);
	} catch (e) {
		console.warn(e);
	}

	if (!stat) {
		return false;
	}

	if (stat) {
		return true;
	}
}

function setup(base) {
	let fpath = path.join(base, MAPPER_FILENAME);
	if (initMapperFile(fpath)) {
		MAPPER_FILE = fpath;
		readMappingSync();
	}
}

const mapper = {
	init: (config, syncServer) => {
		setup(config.SYNC_DIR);
	},
	changeDirectory: (newLocation) => {
		setup(newLocation);
	},
	add: (source, target) => {
		if (typeof source !== "string") {
			console.error("Mapping source must be a string");
			return;
		}
		if (typeof target !== "string") {
			console.error("Mapping target must be a string");
			return;
		}

		let timestamp = (new Date()).getTime() / 1000;

		let newMapping = {
			source: source,
			target: target,
			timestamp: timestamp,
			id: uuid.v1()
		};

		mapping.push(newMapping);
		writeMappingSync();

		return newMapping;
	},
	remove: id => {
		let index = -1;

		for (var i = 0; i < mapping.length; i++) {
			if (mapping[i].id === id) {
				index = i;
				break;
			}
		}

		if (index >= 0) {
			mapping.splice(index);
			mapper.remove(id);
		}
	},
	getMapping: () => {
		return mapping;
	},
	writeMapping: () => {
		writeMappingSync();
	}
}

module.exports = mapper;
