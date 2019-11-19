#! /usr/bin/env node

'use strict';

const ebics = require('../index');
const path = require('path');
const fs = require('fs');
const os = require('os');

const client = new ebics.Client({
	url: 'https://ebics.server',
	partnerId: '',
	userId: '',
	hostId: '',
	passphrase: 'test', // keys-test will be decrypted with this passphrase
	keyStorage: ebics.fsKeysStorage('./keys-test'),
});

const bankName = 'Bank name'; // Change this to the bank name you're going to send the letter to.
const languageCode = 'en'; // Currently 'de' and 'en' are valid values.
const template = fs.readFileSync('../templates/ini_'+languageCode+'.hbs').toString();
const letter = new ebics.BankLetter({ client, bankName, template });
const bankLetterFile = path.join(os.homedir(), 'bankLetter_'+languageCode+'.html');

letter.serialize(bankLetterFile)
	.then(() => {
		console.log('Send your bank the letter (%s)', bankLetterFile);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
