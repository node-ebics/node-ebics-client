'use strict';

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
	dateRange,
};
