const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
const fstream = require('fstream');
const rimraf = require('rimraf');
const {
	parseString
} = require('xml2js');

const PLUGIN_FOLDER = "sync-apparatus-plugin";
var roblox_root = "";

if (process.platform === "win32") {
	roblox_root = path.join(process.env.LOCALAPPDATA, "Roblox");
}

var plugin_root = path.join(roblox_root, "Plugins");

function getGlobalSettings() {
	let settingsPath = path.join(roblox_root, "GlobalSettings_13.xml");
	return new Promise((resolve, reject) => {
		fs.stat(settingsPath, (err, stats) => {
			if (err) {
				return reject(err);
			}
			if (!stats) {
				return reject("No stats for settings file");
			}
			if (!stats.isFile()) {
				return reject("Settings path is not a file");
			}

			fs.readFile(settingsPath, 'UTF-8', (err, data) => {
				if (err) {
					return reject(err);
				}
				if (!data) {
					return reject("Did not get any data from the settings file");
				}
				if (typeof data !== "string") {
					return reject("Didn't get a string from the settings file?!");
				}

				try {
					parseString(data, (err, xmlData) => {
						if (err) {
							return reject(err);
						}

						resolve(xmlData);
					});
				} catch (e) {
					reject(e);
				}
			});
		});
	});
}

function getPluginsDir() {
	return new Promise((resolve, reject) => {
		getGlobalSettings()
			.then(globalSettings => {
				let studio = null;

				globalSettings.roblox.Item.forEach(item => {
					if (item.$.class === "Studio") {
						studio = item;
					}
				});

				if (!studio) {
					return reject("Did not find a studio class in the settings file");
				}

				let pluginsDir = null;
				studio.Properties[0].QDir.forEach(qDir => {
					if (qDir.$.name === "PluginsDir") {
						pluginsDir = qDir;
					}
				});

				if (!pluginsDir) {
					return reject("Did not find pluginsdir QDir");
				}

				if (typeof pluginsDir._ !== "string") {
					return reject("The found pluginsdir is not a string!!");
				}

				resolve(pluginsDir._);
			})
			.catch(err => reject(err));
	});
}

function unzipPlugin(output) {
	let readStream = fs.createReadStream('./resources/app.asar/electron-app/assets/sync-apparatus-plugin.zip');
	let writeStream = fstream.Writer(output);

	readStream
		.pipe(unzip.Parse())
		.pipe(writeStream);
}

function doInstall(targetPath) {
	unzipPlugin(targetPath);
	return true;
}

const pluginInstaller = {
	install: () => {
		// HADOUKEN!
		return new Promise((resolve, reject) => {
			try {
				getPluginsDir()
					.then(plugins => {
						var targetPath = path.join(plugins, PLUGIN_FOLDER);
						fs.stat(targetPath, (err, stat) => {
							if (err) {
								fs.mkdir(targetPath, (err) => {
									if (err) {
										reject(err);
									} else {
										resolve(doInstall(targetPath));
									}
								});
							} else {
								if (stat.isFile()) {
									fs.unlink(targetPath, err => {
										if (err) {
											reject(err);
										} else {
											resolve(doInstall(targetPath));
										}
									})
								} else {
									resolve(doInstall(targetPath));
								}
							}
						})
					})
					.catch(err => {
						reject(err);
					})
			} catch (e) {
				reject(e);
			}
		});
	},
	uninstall: () => {
		return new Promise((resolve, reject) => {
			getPluginsDir()
				.then(plugins => {
					var targetPath = path.join(plugins, PLUGIN_FOLDER);
					rimraf(targetPath, (err) => {
						if (err) {
							return reject(err);
						}

						resolve();
					});
				})
				.catch(err => reject(err));
		});
	},
	getGlobalSettings: getGlobalSettings,
	getPluginsDir: getPluginsDir
}

module.exports = pluginInstaller
