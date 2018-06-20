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

module.exports = (start = null, end = null) => ({
	version: 'h004',
	orderDetails: {
		OrderType: 'VMK',
		OrderAttribute: 'DZHNN',
		StandardOrderParams: dateRange(start, end),
	},
	operation: 'download',
});
