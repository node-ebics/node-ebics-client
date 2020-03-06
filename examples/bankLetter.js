#! /usr/bin/env node

'use strict';

const ebics = require('../index');
const path = require('path');
const fs = require('fs');
const os = require('os');

const config = require('./loadConfig')();
const client = require('./getClient')(config);
const bankName = config.bankName;
const languageCode = config.languageCode;
const template = fs.readFileSync('../templates/ini_'+config.languageCode+'.hbs', { encoding: 'utf8 '});
const bankLetterFile = path.join(os.homedir(), 'bankLetter_'+languageCode+'.html');

const letter = new ebics.BankLetter({ client, bankName, template });

letter.serialize(bankLetterFile)
	.then(() => {
		console.log('Send your bank the letter (%s)', bankLetterFile);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
