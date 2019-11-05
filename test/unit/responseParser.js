'use strict';

/* eslint-env node, mocha */

const { assert } = require('chai');
const H004Response = require('../../lib/orders/H004/response');

describe('H004 response parsing', () => {
	it('parses bank keys', () => {
		const response = H004Response('<xml/>', {});

		const x002mod = 'ntbX6WFjAJP5RyH4ogDG/26wZGzEJXsTudyvcgXmUdk1AExCNqArXDiSlGXpVNq4BKddUMFUmVOyvkdNckPRV2mk3uHNCE5T3tFKQI3FlwHSJHvPSpb9gtHnsK03jByMigWjhTKvsjIdfLVay5m5Bctxq9+5JMHwlNk7MlVXBQcqaFiHFFS1lPfA3Wk1bptPeeGyYcP0+U798oQWnCABKwS8hmYcp5xBtozGoRj9L/NDE68pdP8o/wTKNwT4Jo5nQKYfDsgO4R+z9vVv37Htp6bWhK8Jw3tpkcd3JnkYWx+Ylg0XBpg8LfjFhY2Jc7FqLlx0Bn0Y3PRLI1apxgC85w==';
		const e002mod = '4eOGrzcJHVzbEgZTmyPYUIq9kFoua8Ure1Mvyq6XlawFgCWskfu/xSKNLIMJ7H675wl/5y0Oy16P/b6pJEhWrzOw8omW46PBDTaXw9BDYBTuBblluz1yUnzpgfblP8gkRmxAo+QMIskmwdSzuZMiJcLNSzu/bkmLHK2RdrVYMAZLlB6QXTykdenPZtNmc2z4VU6TRmGljAwg2VUNF6iQoucbzDUuca+yUo3fiXZp69nfXv81X2ND+p1ir6zQpx7tbOdfauw0sEKI/Z/lC+E4fMrMlh/ZvOxSYUMA55J4liC3aUV3mTR3dPJHWu1aD1a7EfJnNw0eHLwlB+36qfgGuw==';

		response.orderData = () => `<?xml version="1.0" encoding="UTF-8"?>
			<HPBResponseOrderData xmlns="urn:org:ebics:H004" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
			  <AuthenticationPubKeyInfo>
				<PubKeyValue>
				  <ds:RSAKeyValue>
					<ds:Modulus>${x002mod}</ds:Modulus>
					<ds:Exponent>AQAB</ds:Exponent>
				  </ds:RSAKeyValue>
				  <TimeStamp>2015-02-25T08:01:13.061Z</TimeStamp>
				</PubKeyValue>
				<AuthenticationVersion>X002</AuthenticationVersion>
			  </AuthenticationPubKeyInfo>
			  <EncryptionPubKeyInfo>
				<PubKeyValue>
				  <ds:RSAKeyValue>
					<ds:Modulus>${e002mod}</ds:Modulus>
					<ds:Exponent>AQAB</ds:Exponent>
				  </ds:RSAKeyValue>
				  <TimeStamp>2015-02-25T08:01:12.344Z</TimeStamp>
				</PubKeyValue>
				<EncryptionVersion>E002</EncryptionVersion>
			  </EncryptionPubKeyInfo>
			  <HostID>SBKPR01</HostID>
			</HPBResponseOrderData>`;

		const bankKeys = response.bankKeys();

		assert.equal(bankKeys.bankX002.mod.toString('base64'), x002mod);
		assert.equal(bankKeys.bankE002.mod.toString('base64'), e002mod);
	});
});
