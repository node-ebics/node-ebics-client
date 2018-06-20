'use strict';

const packageJson = require('../package.json');

const name = 'eCollect Node Ebics Client';
const { version } = packageJson;
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
