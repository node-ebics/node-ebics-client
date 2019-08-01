'use strict';

const packageJson = require('../package.json');

const name = 'Node Ebics Client';
const { version } = packageJson;
const orderOperations = {
	ini: 'INI',
	upload: 'UPLOAD',
	download: 'DOWNLOAD',
};

const dateRange = (start, end) => {
	if (start && end)
		return {
			DateRange: {
				Start: start,
				End: end,
			},
		};

	return {};
};

module.exports = {
	name,
	version,
	orderOperations,
	productString: `${name} ${version}`,
	dateRange,
};
