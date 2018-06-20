'use strict';

const fs = require('fs');

module.exports = (pathToFile) => {
	const path = pathToFile;

	return {
		read() {
			if (!fs.existsSync(path))
				return null;
			return fs.readFileSync(path, { encoding: 'utf8' });
		},

		write(data) {
			fs.writeFileSync(path, data, { encoding: 'utf8' });
			return this;
		},

		hasData() {
			if (fs.existsSync(path))
				return this.read() !== '';

			return false;
		},
	};
};
