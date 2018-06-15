'use strict';

const OrderBuilder = require('./OrderBuilder');

module.exports = class ISO20022OrderBuilder extends OrderBuilder {
	get document() { return this._document; }
	get ebicsData() { return this._ebicsData; }

	use(dataToUse) {
		if (Object.prototype.hasOwnProperty.call(dataToUse, 'ebicsData')) this._ebicsData = dataToUse.ebicsData;
		if (Object.prototype.hasOwnProperty.call(dataToUse, 'document')) this._document = dataToUse.document;

		return this;
	}

	static h004() {
		const builder = new ISO20022OrderBuilder();

		builder._version = 'H004';

		return builder;
	}

	INI() {
		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'INI', OrderAttribute: 'DZNNN' },
		});
	}

	HIA() {
		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'HIA', OrderAttribute: 'DZNNN' },
		});
	}

	HPB() {
		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'HPB', OrderAttribute: 'DZHNN' },
		});
	}

	HKD() {
		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'HKD', OrderAttribute: 'DZHNN', StandardOrderParams: {} },
		});
	}

	HPD() {
		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'HPD', OrderAttribute: 'DZHNN', StandardOrderParams: {} },
		});
	}

	HTD() {
		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'HTD', OrderAttribute: 'DZHNN', StandardOrderParams: {} },
		});
	}

	HAA() {
		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'HAA', OrderAttribute: 'DZHNN', StandardOrderParams: {} },
		});
	}

	HAC(start = null, end = null) {
		const params = start && end
			? { DateRange: { Start: start, End: end } }
			: {};

		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'HAC', OrderAttribute: 'DZHNN', StandardOrderParams: params },
		});
	}

	PTK(start = null, end = null) {
		const params = start && end
			? { DateRange: { Start: start, End: end } }
			: {};

		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'PTK', OrderAttribute: 'DZHNN', StandardOrderParams: params },
		});
	}

	Z52() {
		return this.details({
			ebicsData: this.ebicsData,
			orderDetails: { OrderType: 'Z52', OrderAttribute: 'DZHNN', StandardOrderParams: {} },
		});
	}
};
