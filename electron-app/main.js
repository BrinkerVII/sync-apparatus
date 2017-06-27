const path = require('path');
const fs = require('fs');
const os = require('os');

const PLUGIN_HREF = "https://www.roblox.com/library/886801297/Sync-apparatus-plugin";
const syncServer = require('./sync-server/index');

const {
	app,
	shell,
	BrowserWindow,
	dialog
} = require("electron");

const pluginInstaller = require('./plugin-installer');

const WEB_FOLDER = 'www';
const FILE_PROTOCOL = 'file';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	})

	if (process.env.DEBUG_ENABLED) {
		mainWindow.loadURL(`file:///${__dirname}/dev-loader.html`);
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadURL(`file:///${__dirname}/www/index.html`);
	}

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
		syncServer.getMapper().writeMapping()
			.then(data => {})
			.catch(err => {
				console.error(err);
			});
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

exports.provider = {
	openWindow: () => {
		let window = new BrowserWindow({
			width: 800,
			height: 600
		});

		window.loadURL("https://www.google.com");
	},
	browseFolder: () => {
		let response = {
			code: -1,
			message: "",
			paths: []
		}

		if (!mainWindow) {
			response.code = -1;
			response.message = "Main window does not exist?!";
			return response;
		}

		response.paths = dialog.showOpenDialog({
			properties: [
				"openDirectory"
			]
		});

		response.code = 0;
		return response;
	},
	changeProjectFolder: newLocation => {
		if (typeof newLocation !== "string") {
			throw "New location must be a string!";
		}

		syncServer.changeProjectFolder(newLocation);
	},
	on: (event, callback) => {
		let r = null;

		switch (event) {

			default: r = syncServer.on(event, callback);
			break;
		}

		return r;
	},
	getChanges: () => {
		return syncServer.getFileWatcher().getChanges();
	},
	getProjectFolder: () => {
		return syncServer.getFileWatcher().getSyncDir();
	},
	getPollData: () => {
		return syncServer.getPollData();
	},
	refreshProject: () => {
		syncServer.getFileWatcher().refreshProject();
	},
	getSyncServer: () => {
		return syncServer;
	},
	getPluginInstaller: () => {
		return pluginInstaller;
	},
	getRoot: () => {
		return fs.readdirSync(".");
	},
	readASAR: () => {
		return fs.readdirSync("./resources/app.asar/");
	},
	openPluginInBrowser: () => {
		shell.openItem(PLUGIN_HREF);
	}
}
