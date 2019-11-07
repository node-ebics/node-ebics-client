'use strict';

const { version } = require('../package.json');

const name = 'Node Ebics Client';
const orderOperations = {
	ini: 'INI',
	upload: 'UPLOAD',
	download: 'DOWNLOAD',
};

module.exports = {
	name,
	version,
	orderOperations,
	productString: `${name} ${version}`,
};
