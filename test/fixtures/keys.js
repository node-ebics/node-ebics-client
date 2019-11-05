'use strict';

const publicSmallExpPEM = '';
const publicSmallExpMod = '';
const publicSmallExpExp = '';

const publicBigPEM = `-----BEGIN PUBLIC KEY-----
MIIBJDANBgkqhkiG9w0BAQEFAAOCAREAMIIBDAKCAQEAuvqhJ2ptulHGUmYq3BOO
NoIDXOUDrVV3s188wvU3Fj9TcO3yBqWuJ5GMEzRIOfi8Pb4AkJBjjPOR0Taby7+n
7coa2Zm0ZprGzXVM1Gb0aG3BAbDaFbvdF25NLAtkmtKKW/8YfXy89qvy6+UEBdOa
1UTLaR+9Pf63Wa+qu638udSDe3refHdZV1bKUR1UOZ/1iWn5b7aq4vITRPNNWXk5
eG8He2lWzYHg5+yY4ckBooh1K5cMwl5s+Iz24iWtqIlV5EyORbdfGatrNzv6S7Lx
FngEGCL5e97qU1pAcarE9XmrlJ5dHl9LQPaw957AlZuOFpVEE5shXZkSgRYrHv2m
cQIFAQAAAA8=
-----END PUBLIC KEY-----`;
const publicBigModString = 'ALr6oSdqbbpRxlJmKtwTjjaCA1zlA61Vd7NfPML1NxY/U3Dt8galrieRjBM0SDn4vD2+AJCQY4zzkdE2m8u/p+3KGtmZtGaaxs11TNRm9GhtwQGw2hW73RduTSwLZJrSilv/GH18vPar8uvlBAXTmtVEy2kfvT3+t1mvqrut/LnUg3t63nx3WVdWylEdVDmf9Ylp+W+2quLyE0TzTVl5OXhvB3tpVs2B4OfsmOHJAaKIdSuXDMJebPiM9uIlraiJVeRMjkW3Xxmrazc7+kuy8RZ4BBgi+Xve6lNaQHGqxPV5q5SeXR5fS0D2sPeewJWbjhaVRBObIV2ZEoEWKx79pnE=';
const publicBigModBytes = [0, 186, 250, 161, 39, 106, 109, 186, 81, 198, 82, 102, 42, 220, 19, 142, 54, 130, 3, 92, 229, 3, 173, 85, 119, 179, 95, 60, 194, 245, 55, 22, 63, 83, 112, 237, 242, 6, 165, 174, 39, 145, 140, 19, 52, 72, 57, 248, 188, 61, 190, 0, 144, 144, 99, 140, 243, 145, 209, 54, 155, 203, 191, 167, 237, 202, 26, 217, 153, 180, 102, 154, 198, 205, 117, 76, 212, 102, 244, 104, 109, 193, 1, 176, 218, 21, 187, 221, 23, 110, 77, 44, 11, 100, 154, 210, 138, 91, 255, 24, 125, 124, 188, 246, 171, 242, 235, 229, 4, 5, 211, 154, 213, 68, 203, 105, 31, 189, 61, 254, 183, 89, 175, 170, 187, 173, 252, 185, 212, 131, 123, 122, 222, 124, 119, 89, 87, 86, 202, 81, 29, 84, 57, 159, 245, 137, 105, 249, 111, 182, 170, 226, 242, 19, 68, 243, 77, 89, 121, 57, 120, 111, 7, 123, 105, 86, 205, 129, 224, 231, 236, 152, 225, 201, 1, 162, 136, 117, 43, 151, 12, 194, 94, 108, 248, 140, 246, 226, 37, 173, 168, 137, 85, 228, 76, 142, 69, 183, 95, 25, 171, 107, 55, 59, 250, 75, 178, 241, 22, 120, 4, 24, 34, 249, 123, 222, 234, 83, 90, 64, 113, 170, 196, 245, 121, 171, 148, 158, 93, 30, 95, 75, 64, 246, 176, 247, 158, 192, 149, 155, 142, 22, 149, 68, 19, 155, 33, 93, 153, 18, 129, 22, 43, 30, 253, 166, 113];
const publicBigExpString = 'AQAAAA8=';
const publicBigExpBytes = [1, 0, 0, 0, 15];


const pblc = {
	big: {
		pem: publicBigPEM,
		mod: {
			bytes: publicBigModBytes,
			string: publicBigModString,
		},
		exp: {
			bytes: publicBigExpBytes,
			string: publicBigExpString,
		},
	},
	small: {
		pem: publicSmallExpPEM,
		mod: publicSmallExpMod,
		exp: publicSmallExpExp,
	},
};

module.exports = {
	pblc,
};
