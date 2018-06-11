'use strict';

const H004Response = require('../versions/H004/Response');

module.exports = class ParseResponse {
	static parse(data, keys, version) {
		if (version.toUpperCase() === 'H004') return new H004Response(data, keys);

		throw Error('Unknow EBICS response version');
	}
};
