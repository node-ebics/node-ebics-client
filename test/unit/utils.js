'use strict';

/* eslint-env node, mocha */

const { assert } = require('chai');

const utils = require('../../lib/utils');

describe('utils', () => {
	describe('dateRange', () => {
		describe('dateRange', () => {
			it('should generate empty object with partial parameters', () => {
				assert.isEmpty(utils.dateRange());
			});
			it('should throw with invalid date', () => {
				assert.throws(() => utils.dateRange('2018-15-15', '2018-20-20'));
			});
			it('should work for valid string input', () => {
				assert.containsAllDeepKeys(utils.dateRange('2018-01-15', '2018-01-20'), { DateRange: { Start: '2018-01-15', End: '2018-01-20' } });
			});
			it('should work for Date string input', () => {
				assert.containsAllDeepKeys(utils.dateRange(new Date('2018-01-15'), new Date('2018-01-20')), { DateRange: { Start: '2018-01-15', End: '2018-01-20' } });
			});
			it('should work for timestamp string input', () => {
				assert.containsAllDeepKeys(utils.dateRange(new Date('2018-01-15').getTime(), new Date('2018-01-20').getTime()), { DateRange: { Start: '2018-01-15', End: '2018-01-20' } });
			});
		});
	});
});
