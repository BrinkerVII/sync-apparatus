const http = require('http');
const path = require('path');

var syncServer;
var fileWatcher = null;
var mapper = null;

function httpServerCallback(request, response) {
	let requestBody = [];

	if (request.method === "OPTIONS") {
		response.setHeader("Content-Type", "text/plain");
		response.end("GET, POST, PUT, DELETE, PATCH");
		return;
	}

	response.statusCode = 200;
	response.statusMessage = "OK";
	response.setHeader("Content-Type", "text/html");

	request.on("data", chunk => {
		requestBody.push(chunk);
	});

	request.on("end", () => {
		let body = Buffer.concat(requestBody).toString();
		let bodyJSON = [];
		if (body.length > 3) {
			try {
				bodyJSON = JSON.parse(body);
			} catch (e) {
				bodyJSON = [];
			}
		}

		switch (request.url) {
			case "/poll":
				response.end(JSON.stringify(syncServer.getPollData()));
				break;
			case "/structure":
				response.end(JSON.stringify(syncServer.getFileWatcher().getStructure()));
				break;
			case "/changes":
				response.end(JSON.stringify(fileWatcher.getChanges()));
				break;
			case "/changes/structure":
				let directories = []
				fileWatcher.getChanges().forEach(change => {
					if (change.isDirectory) {
						directories.push(change);
					}
				});

				response.end(JSON.stringify(directories));
				break;
			case "/changes/deletions":
				response.end(JSON.stringify(fileWatcher.getDeletions()));
				break;
			case "/changes/take":
				response.end(JSON.stringify(fileWatcher.takeChanges()));
				break;
			case "/changes/resolve":
				let deleteCount = 0;
				if (fileWatcher) {
					deleteCount = fileWatcher.resolveChanges(bodyJSON);
				}
				response.end(deleteCount.toString());
				break;
			default:
				response.setHeader("Content-Type", "text/html");
				response.end("<h1>404 Not Found</h1>");
				break;
		}
	});
}

var server;

const httpServer = {
	init: (config, server) => {
		syncServer = server;
		fileWatcher = syncServer.getFileWatcher();

		if (!fileWatcher) {
			throw "HTTP server did not get a file watcher :("
		}

		server = http.createServer((req, res) => {
			httpServerCallback(req, res);
		});

		server.listen(config.HTTP_PORT, config.HTTP_HOSTNAME, () => {
			console.log(`HTTP Server running at ${config.HTTP_HOSTNAME}:${config.HTTP_PORT}`);
		});
	}
}

module.exports = httpServer;
