'use strict';

const H004Response = require('../orders/H004/response');

module.exports = {
	version(v) {
		if (v.toUpperCase() === 'H004') return H004Response;

		throw Error('Error from middleware/response.js: Invalid version number');
	},
};
