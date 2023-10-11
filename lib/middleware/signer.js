"use strict";

const H004Signer = require("../orders/H004/signer");

module.exports = {
	version(v) {
		if (v.toUpperCase() === "H004") return H004Signer;

		throw Error("Error from middleware/signer.js: Invalid version number");
	},
};
