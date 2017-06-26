const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const MAPPER_FILENAME = ".mapping.json";
var MAPPER_FILE = MAPPER_FILENAME;

var mapping = [];

function getMapString() {
	return JSON.stringify(mapping);
}

function openFile(filePath, options) {
	if (!options) {
		options = "rw";
	}

	return new Promise((resolve, reject) => {
		fs.open(filePath, options, (err, fd) => {
			if (err) {
				return reject(err);
			}

			if (fd) {
				return resolve(fd);
			}

			reject("Failed to open file");
		});
	});
}

function closeFile(fd) {
	return new Promise((resolve, reject) => {
		fs.close(fd, (err) => {
			if (err) {
				return reject(err);
			}

			resolve(true);
		})
	});
}

function mkdir(path) {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}

function statBaseDirectory(basePath) {
	return new Promise((resolve, reject) => {
		fs.stat(basePath, (err, stat) => {
			if (err) {
				return reject(err);
			}

			resolve(stat);
		});
	});
}

function writeMapping(targetPath) {
	if (!targetPath) {
		targetPath = MAPPER_FILE;
	}

	return new Promise((resolve, reject) => {
		openFile(targetPath, "w")
			.then(fd => {
				fs.writeFile(fd, getMapString(), 0, 'UTF-8', (err) => {
					if (err) {
						closeFile(fd)
							.then(b => {
								reject(err);
							})
							.catch(moreErr => {
								reject([err, moreErr]);
							})
						return;
					}

					closeFile(fd)
						.then(b => resolve(b))
						.catch(err => reject(err));
				});
			})
			.catch(err => reject(err));
	});
}

function statMapperFile(basePath) {
	return new Promise((resolve, reject) => {
		statBaseDirectory()
			.then(bstat => {
				if (!bstat.isDirectory()) {
					return reject("Base path for the mapper file must be a directory");
				}

				let mapperPath = path.join(basePath, MAPPER_FILENAME);
				fs.stat(mapperPath, (err, stat) => {
					if (err) {
						return reject(err);
					}

					if (!stat.isFile()) {
						return reject("Mapper found, but it is not a file");
					}

					MAPPER_FILE = mapperPath;
					resolve(stat);
				});
			})
			.catch(err => reject(err));
	});
}

function readMapperFile(filePath) {
	return new Promise((resolve, reject) => {
		statMapperFile(filePath)
			.then(b => {
				fs.readFile(filePath, 'UTF-8', (err, data) => {
					if (err) {
						return reject(err);
					}

					if (!data) {
						// This means the file is empty, I hope
						data = getMapString();
					}

					resolve(data);
				});
			})
			.catch(err => reject(err));
	})
}

function makeMapperIfNotExists(basePath) {
	return new Promise((resolve, reject) => {
		statMapperFile(basePath)
			.then(stat => resolve(true))
			.catch(err => {
				console.warn(err);

				statBaseDirectory(basePath)
					.then(stat => {
						console.log("Base directory exists, yay");
					})
					.catch(err => {
						mkdir(basePath)
							.then(b => {
								writeMapping(MAPPER_FILE)
									.then(b => resolve(b))
									.catch(err => reject(err));
							})
							.catch(err => reject(err));
					});
			});
	});
}

function setup(base) {
	return new Promise((resolve, reject) => {
		makeMapperIfNotExists(base)
			.then(b => {
				let mapperPath = path.join(base, MAPPER_FILENAME);
				if (mapperPath != MAPPER_FILE) {
					return reject("Something wonky and weird went wrong here");
				}

				readMapperFile(mapperPath)
					.then(mapping_data => {
						mapping = mapping_data;
						resolve(mapping);
					})
					.catch(err => reject(err));
			})
			.catch(err => reject(err));
	});
}

const mapper = {
	init: (config, syncServer) => {
		return new Promise((resolve, reject) => {
			setup(config.SYNC_DIR)
				.then(data => resolve(data))
				.catch(err => reject(err));
		});
	},
	changeDirectory: (newLocation) => {
		return new Promise((resolve, reject) => {
			setup(newLocation)
				.then(data => resolve(data))
				.catch(err => reject(err));
		});
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
