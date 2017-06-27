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

file_watcher.init(config, syncServer);
mapper.init(config, syncServer)
	.then(data => {
		http_server.init(config, syncServer);
	})
	.catch(err => {
		console.error("Failed to init mapper");
		console.error(err);
	});

module.exports = syncServer
