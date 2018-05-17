'use strict';

const crypto = require('crypto');

const NodeRSA = require("node-rsa");
const BN      = require('bn.js');

module.exports = class Key {
    constructor(encodedKey, passphrase = null) {
        if (encodedKey instanceof NodeRSA) {
            this.key = encodedKey
        } else {
            this.key = new NodeRSA(encodedKey);
        }
	};

	publicDigest() {
		const str = [this.e().replace(/^(0+)/g, ''), this.n().replace(/^(0+)/g, '')].map((x) => x.toLowerCase()).join(' ');

		return crypto.createHash('sha256').update(str).digest('base64').trim();
	};

	publicEncrypt(str) {
		return this.key.encrypt(str);
	}

    n() {
        return this.key.exportKey("components-public").n.toString("hex", 1);
	};

	e() {
		return new BN(this.key.exportKey("components-public").e).toBuffer().toString('hex');
	};

	toPem() {
		return this.key.isPrivate() ? this.key.exportKey("pkcs1-private-pem") : this.key.exportKey("pkcs8-public-pem");
	}
};
