'use strict';

const prefixNumber = (n) => {
	if (n < 10)
		return `0${n}`;
	return n.toString();
};

const date = {
	getDateObject(d = Date.now()) {
		const dateObject = new Date(d);
		// eslint-disable-next-line no-restricted-globals
		if (isNaN(dateObject))
			throw new Error(`${d} is invalid date.`);
		return dateObject;
	},
	toISODate(d = Date.now(), utc = true) {
		const t = date.getDateObject(d);
		if (utc)
			return `${t.getUTCFullYear()}-${prefixNumber(t.getUTCMonth() + 1)}-${prefixNumber(t.getUTCDate())}`;
		return `${t.getFullYear()}-${prefixNumber(t.getMonth() + 1)}-${prefixNumber(t.getDate())}`;
	},
	toISOTime(d = Date.now(), utc = true) {
		const t = date.getDateObject(d);
		if (utc)
			return `${prefixNumber(t.getUTCHours())}:${prefixNumber(t.getUTCMinutes())}:${prefixNumber(t.getUTCSeconds())}`;
		return `${prefixNumber(t.getHours())}:${prefixNumber(t.getMinutes())}:${prefixNumber(t.getSeconds())}`;
	},
};

const dateRange = (start, end) => {
	if (start && end)
		return {
			DateRange: {
				Start: date.toISODate(start),
				End: date.toISODate(end),
			},
		};

	return {};
};

module.exports = {
	dateRange,
	date,
};
