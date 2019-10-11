
'use strict';

// const crypto = require('crypto');
const Crypto = require('../../crypto/Crypto');

const { DOMParser, XMLSerializer } = require('xmldom');
const xpath = require('xpath');
const C14n = require('xml-crypto/lib/c14n-canonicalization').C14nCanonicalization;

const digest = (doc) => {
	// get the xml node, where the digested value is supposed to be
	const nodeDigestValue = doc.getElementsByTagName('ds:DigestValue')[0];

	// canonicalize the node that has authenticate='true' attribute
	const contentToDigest = xpath.select("//*[@authenticate='true']", doc)
		.map(x => new C14n().process(x)).join('');

	// fix the canonicalization
	const fixedContent = contentToDigest.replace(/xmlns="urn:org:ebics:H004"/g, 'xmlns="urn:org:ebics:H004" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"');

	if (nodeDigestValue)
		nodeDigestValue.textContent = Crypto.digestWithHash(fixedContent).toString('base64').trim();

	return doc;
};

const sign = (doc, key) => {
	const nodeSignatureValue = doc.getElementsByTagName('ds:SignatureValue')[0];

	if (nodeSignatureValue) {
		const select = xpath.useNamespaces({ ds: 'http://www.w3.org/2000/09/xmldsig#' });
		const contentToSign = (new C14n().process(select('//ds:SignedInfo', doc)[0])).replace('xmlns:ds="http://www.w3.org/2000/09/xmldsig#"', 'xmlns="urn:org:ebics:H004" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"');

		nodeSignatureValue.textContent = Crypto.privateSign(key, contentToSign); // this.keys.x().key.sign(contentToSign, 'base64');
	}

	return doc;
};

const toXML = doc => new XMLSerializer().serializeToString(doc);

module.exports = {
	sign(data, keyX) {
		const doc = new DOMParser().parseFromString(data, 'text/xml');

		return toXML(sign(digest(doc), keyX));
	},
};
