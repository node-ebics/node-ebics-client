'use strict';

const moment = require('moment');

const dateRange = (start, end) => {
	if (start && end) {
		if (start instanceof Date) {
			start = moment(start).format('YYYY-MM-DD');
		}
		if (end instanceof Date) {
			end = moment(end).format('YYYY-MM-DD');
		}
		return {
			DateRange: {
				Start: start,
				End: end,
			},
		};
	}

	return {};
};


module.exports = {
	dateRange,
};
