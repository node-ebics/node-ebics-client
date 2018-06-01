'use strict';

const packageJson = require('../package.json');

const name = 'eCollect Node Ebics Client';
const { version } = packageJson;

module.exports = {
	name,
	version,
	productString: `${name} ${version}`,
};
