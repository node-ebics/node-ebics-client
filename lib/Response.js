'use strict';

const zlib   = require('zlib');
const crypto = require("crypto");

const DOMParser     = require("xmldom").DOMParser;
const XMLSerializer = require("xmldom").XMLSerializer;
const xpath = require("xpath");

module.exports = class Response {
	constructor(client, data) {
		this.client = client;
		this.doc    = new DOMParser().parseFromString(data, 'text/xml');
	};

	isSegmented() {
		const select = xpath.useNamespaces({'xmlns': "urn:org:ebics:H004"});
		const node   = select("//xmlns:header/xmlns:mutable/xmlns:SegmentNumber", this.doc);

		return node.length ? true: false;
	}

	isLastSegment() {
		const select = xpath.useNamespaces({'xmlns': "urn:org:ebics:H004"});
		const node = select("//xmlns:header/xmlns:mutable/*[@lastSegment='true']", this.doc);

		return node.length ? true: false;
	}

	orderData() {
		const orderData = this.doc.getElementsByTagNameNS("urn:org:ebics:H004", "OrderData")[0].textContent;
		const decipher  = crypto.createDecipheriv('aes-128-cbc', this.transactionKey(), Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,])).setAutoPadding(false);
		const data      = Buffer.from(decipher.update(orderData, 'base64', 'binary') + decipher.final('binary'), 'binary');

		return zlib.inflateSync(data).toString();
	}

	transactionKey() {
		const keyNodeText = this.doc.getElementsByTagNameNS("urn:org:ebics:H004", "TransactionKey")[0].textContent;
		const tkEncrypted = Buffer.from(keyNodeText, 'base64');

		this.client.e().key.setOptions({encryptionScheme: 'pkcs1'});

		return this.client.e().key.decrypt(tkEncrypted);
	}

	transactionId() {
		const select = xpath.useNamespaces({'xmlns': "urn:org:ebics:H004"});
		const node   = select("//xmlns:header/xmlns:static/xmlns:TransactionID", this.doc);

		return node.length ? node[0].textContent : '';
	}

	toXML() {
		return new XMLSerializer().serializeToString(this.doc);
	}
};
