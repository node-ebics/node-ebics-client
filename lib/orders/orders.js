'use strict';

const orders = {
	H004: {
		ini: ['INI', 'HIA', 'HPB'],
		download: ['HAA', 'HTD', 'XTD', 'HPD', 'HKD', 'PTK', 'HAC', 'STA', 'VMK', 'C52', 'C53', 'C54', 'Z01'],
		upload: ['AZV', 'CD1', 'CDB', 'CDD', 'CDS', 'CCT', 'CCS', 'XE3'],
	},
};

module.exports = {
	version(v) {
		this.orders = orders[v.toUpperCase()];

		return this;
	},

	isIni(orderType) {
		const { ini } = this.orders;

		return ini.includes(orderType.toUpperCase());
	},

	isDownload(orderType) {
		const { download } = this.orders;

		return download.includes(orderType.toUpperCase());
	},

	isUpload(orderType) {
		const { upload } = this.orders;

		return upload.includes(orderType.toUpperCase());
	},
};
