'use strict';

const fs = require('fs');

module.exports = (pathToFile) => {
	const path = pathToFile;

	return {
		write(data) {
			return new Promise((resolve, reject) => {
				fs.writeFile(path, data, { encoding: 'utf8' }, (error) => {
					if (error) reject(error);

					return resolve();
				});
			});
		},

		read() {
			return new Promise((resolve, reject) => {
				fs.readFile(path, { encoding: 'utf8' }, (error, data) => {
					if (error) reject(error);

					return resolve(data);
				});
			});
		},
	};
};
