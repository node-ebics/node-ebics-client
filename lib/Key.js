'use strict';

const crypto = require('crypto');

const BN      = require('bn.js');
const NodeRSA = require("node-rsa");

const MGF1    = require('./MGF1');

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

	publicEncrypt(buf) {
		return crypto.publicEncrypt({ 'key': this.toPem(), padding: crypto.constants.RSA_PKCS1_PADDING }, buf);
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

	sign(msg, salt = crypto.randomBytes(32)) {
		const base  = new BN(this._emsaPSS(msg, salt));
		const power = new BN(this.key.keyPair.d.toBuffer());
		const mod   = new BN(this.key.keyPair.n.toBuffer());

		return (this._modPow(base, power, mod)).toBuffer().toString('base64');
	}

	_emsaPSS(msg, salt) {
		const eightNullBytes = Buffer.from("\x00".repeat(8));
		const digestedMsg    = crypto.createHash('sha256').update(msg).digest();
		const mTickHash      = crypto.createHash('sha256').update(Buffer.concat([eightNullBytes, digestedMsg, salt]), 'binary').digest();

		const ps             = Buffer.from("\x00".repeat(190));
		const db             = Buffer.concat([ps, Buffer.from("\x01"), salt]);

		const dbMask         = MGF1.generate(mTickHash, db.length);
		const maskedDb       = MGF1.xor(db, dbMask);					// so far so good

		let maskedDbMsb      = (new MGF1)._rjust(new BN(maskedDb.slice(0, 1), 2).toString(2), 8, "0");
		maskedDbMsb          = "0" + maskedDbMsb.substr(1);

		maskedDb[0]          = (new BN(maskedDbMsb, 2).toBuffer())[0];

		return Buffer.concat([maskedDb, mTickHash, Buffer.from('BC', 'hex')]);
	}

	_modPow(base, power, mod) {
		let result = new BN(1);

		while( power > 0 ) {
			result = power.and(new BN(1)) == 1 ? (result.mul(base)).mod(mod) : result;
			base = (base.mul(base)).mod(mod);
			power = power.shrn(1);
		}

		return result;
	}
};
