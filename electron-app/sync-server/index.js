"use strict";

const fs = require('fs');
const path = require('path');
const http = require('http');

const file_watcher = require('./file-watcher');
const http_server = require('./http-server');
const mapper = require('./mapper');

const config = {
	HTTP_HOSTNAME: "localhost",
	HTTP_PORT: 2020,
	SYNC_DIR: "./to-sync"
}

const syncServer = {
	changeProjectFolder: newLocation => {
		mapper.changeDirectory(newLocation);
		file_watcher.changeDirectory(newLocation);
	},
	on: (event, callback) => {
		return file_watcher.on(event, callback);
	},
	getFileWatcher: () => {
		return file_watcher;
	},
	getMapper: () => {
		return mapper;
	},
	getPollData: () => {
		return {
			timestamp: (new Date()).getTime() / 1000,
			nchanges: file_watcher.countChanges(),
			mapping: mapper.getMapping()
		};
	}
}

mapper.init(config, syncServer);
file_watcher.init(config, syncServer);
http_server.init(config, syncServer);

module.exports = syncServer
