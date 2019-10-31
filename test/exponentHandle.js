'use strict';

const { assert } = require('chai');
const H004Response = require('../lib/orders/H004/response');

describe('H004 response parsing', () => {
	it('parses bank keys exp', () => {
		const response = H004Response('<xml/>', {});

		const x002mod = 'AJ2/0OoIZydb9sgKbiwqDcwA0NtcUMIYi6GK7PqoRszu1uytGnxJjQhGt62kMslWvLgebUSwdq/T3YyGsa3KQeIGaUUn9iqyu3BoNOMdo2DLN4NdGMY1WR/HbYRKR3JHyURhTBKw27KScRRdKGl6jY+VcXcTKJL8PjXMQH5cD6Gz'; // 'ALr6oSdqbbpRxlJmKtwTjjaCA1zlA61Vd7NfPML1NxY/U3Dt8galrieRjBM0SDn4vD2+AJCQY4zzkdE2m8u/p+3KGtmZtGaaxs11TNRm9GhtwQGw2hW73RduTSwLZJrSilv/GH18vPar8uvlBAXTmtVEy2kfvT3+t1mvqrut/LnUg3t63nx3WVdWylEdVDmf9Ylp+W+2quLyE0TzTVl5OXhvB3tpVs2B4OfsmOHJAaKIdSuXDMJebPiM9uIlraiJVeRMjkW3Xxmrazc7+kuy8RZ4BBgi+Xve6lNaQHGqxPV5q5SeXR5fS0D2sPeewJWbjhaVRBObIV2ZEoEWKx79pnE=';
		const e002mod = 'AOzWaiT7aGESXcI3dqLY3RRD36inlZTGmNNprKd/t9uHfoMeLwZHeMwtjCRWjsuZEyBupkNSFWb3vBlxDyhcyTgpbbbcHsDGqF2zCJaK85xUphoH9mKHxbnA8ZlXzmtHwDmwVSns0FAslIqD+Xr+WycQpeCBEK12D8Ii032YS814ZUKHJ1MkS65A5PE0lcvMTyIE7ruG1kFz85F4nX8eWq77mDEiBONkA5RSUb5duGnRohdNYBgO8K6Wn18aDdISGDyPyXHNvC70v8tfWbF9VGE3rXVGcgjpezZZxC8d47vL0x6lOeslgl7s8N456ntAa+oGHRurt5mEhDz1DZg+EJc=';
		const exponent = 'AQAB'; // 'AQAAAA8=';

		response.orderData = () => `<?xml version="1.0" encoding="UTF-8"?>
			<HPBResponseOrderData xmlns="urn:org:ebics:H004" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
			  <AuthenticationPubKeyInfo>
				<PubKeyValue>
				  <ds:RSAKeyValue>
					<ds:Modulus>${x002mod}</ds:Modulus>
					<ds:Exponent>${exponent}</ds:Exponent>
				  </ds:RSAKeyValue>
				  <TimeStamp>2015-02-25T08:01:13.061Z</TimeStamp>
				</PubKeyValue>
				<AuthenticationVersion>X002</AuthenticationVersion>
			  </AuthenticationPubKeyInfo>
			  <EncryptionPubKeyInfo>
				<PubKeyValue>
				  <ds:RSAKeyValue>
					<ds:Modulus>${e002mod}</ds:Modulus>
					<ds:Exponent>${exponent}</ds:Exponent>
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
