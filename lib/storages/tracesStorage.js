'use strict';

const fs = require('fs');

const uuidv1 = require('uuid/v1');

const traceName = (uuid, label, type, ext = 'xml') => `${uuid}_${label}_${type}.${ext}`;

module.exports = dir => ({
	traceData: '',
	traceLabel: '',
	lastTraceID: null,
	connectToLastTrace: false,

	label(str) {
		this.traceLabel = str;

		return this;
	},

	data(data) {
		if (!data)
			throw Error('No trace given to be persisted.');

		this.traceData = data;

		return this;
	},

	ofType(type) {
		this.type = type;

		return this;
	},

	new() {
		this.connectToLastTrace = false;

		return this;
	},

	connect() {
		this.connectToLastTrace = true;

		return this;
	},

	persist() {
		if (!dir)
			throw Error('No directory to save the traces to provided.');

		this.lastTraceID = this.connectToLastTrace ? this.lastTraceID : uuidv1();

		const name = traceName(this.lastTraceID, this.traceLabel, this.type);
		const path = `${dir}/${name}`;

		try {
			fs.writeFileSync(path, this.traceData);
		} catch (error) {
			throw error;
		}
	},
});
