#! /usr/bin/env node

'use strict';

const ebics = require('../index');
const path = require('path');
const fs = require('fs');
const os = require('os');
const configjs = require('./config.js');

const client = gClient;

const bankName = gConfig.bankName;
const languageCode = gConfig.languageCode;
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
