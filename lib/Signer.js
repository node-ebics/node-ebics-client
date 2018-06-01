'use strict';

const crypto = require('crypto');

const { DOMParser, XMLSerializer } = require('xmldom');
const select = require('xpath.js');
const C14n = require('xml-crypto/lib/c14n-canonicalization').C14nCanonicalization;


module.exports = class Signer {
	/**
	 * Contructor.
	 *
	 * @param {Client} client
	 * @param {String} data
	 */
	constructor(client, data) {
		/**
		 * The main client
		 *
		 * @type {Signer}
		 */
		this.client = client;

		/**
		 * Request data - generated xml
		 *
		 * @type {...}
		 */
		this.doc = new DOMParser().parseFromString(data, 'text/xml');
	}

	_junk() {
		this.digest();
		this.sign();
		// console.log(this.toXML());
		/* const headerSet = select(this.doc, "//*[@authenticate='true']").map(x => {
			 // x.setAttribute('xmlns:ds', 'http://www.w3.org/2000/09/xmldsig#');
			return new c14n().process(x);
		}).join();
		const can = headerSet.replace('xmlns="urn:org:ebics:H004"', 'xmlns="urn:org:ebics:H004" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"');

		const hash = crypto.createHash('sha256');
		hash.update(can);
		const digester = hash.digest('base64').trim();
		if ( this.doc.getElementsByTagName("ds:DigestValue")[0] )
			this.doc.getElementsByTagName("ds:DigestValue")[0].textContent = digester; */

		/* const nodeSet = select(this.doc, "//ds:SignedInfo");
		const canonicalized = nodeSet.map(x => {
			const g = x.toString();
			const res = new c14n().process(x);
			return res;
		}).join();

		const canonicalizedString = canonicalized.replace('xmlns:ds="http://www.w3.org/2000/09/xmldsig#"', 'xmlns="urn:org:ebics:H004" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"');

		// const SIGN = crypto.createSign('RSA-SHA256');
		// SIGN.update(canonicalizedString);
		// const key = SIGN.sign(this.client.x().key.exportKey("pkcs1-private-pem"), 'base64');
		const f = this.client.x().key.sign(canonicalizedString, 'base64');
		if ( this.doc.getElementsByTagName("ds:SignatureValue")[0] ) {
			this.doc.getElementsByTagName("ds:SignatureValue")[0].textContent = f;
		} */
	}

	digest() {
		// get the xml node, where the digested value is supposed to be
		const nodeDigestValue = this.doc.getElementsByTagName('ds:DigestValue')[0];

		// const nodes = select(this.doc, "//*[@authenticate='true']");

		// canonicalize the node that has authenticate='true' attribute
		// const contentToDigest = select(this.doc, '//*[@authenticate="true"]')
		const contentToDigest = select(this.doc, "//*[@authenticate='true']")
			.map(x => new C14n().process(x)).join('');

		console.log('digest', 'contentToDigest', contentToDigest);
		// fix the canonicalization
		const fixedContent = contentToDigest.replace(/xmlns="urn:org:ebics:H004"/g, 'xmlns="urn:org:ebics:H004" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"');

		if (nodeDigestValue)
			nodeDigestValue.textContent = crypto.createHash('sha256').update(fixedContent).digest('base64').trim();
	}

	sign() {
		const nodeSignatureValue = this.doc.getElementsByTagName('ds:SignatureValue')[0];

		console.log('sign =>');
		if (nodeSignatureValue) {
			const contentToSign = (new C14n().process(select(this.doc, '//ds:SignedInfo')[0])).replace('xmlns:ds="http://www.w3.org/2000/09/xmldsig#"', 'xmlns="urn:org:ebics:H004" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"');

			nodeSignatureValue.textContent = this.client.x().key.sign(contentToSign, 'base64');
		}
	}

	toXML() {
		return new XMLSerializer().serializeToString(this.doc);
	}
};
