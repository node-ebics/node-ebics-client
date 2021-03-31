'use strict';

const fs = require('fs');
const path = require('path');

const safeLoadJson = (file) => {
	if (!file)
		return {};

	try {
		return JSON.parse(fs.readFileSync(file));
	} catch (e) {
		console.warn(`Couldn't load ${file} config file.`);
		return {};
	}
}

var argv = require('yargs/yargs')(process.argv.slice(2))
	.string(['environment', 'hostid', 'ordertype', 'entity', 'startdate', 'enddate', 'filename'])
	.demandOption(['environment', 'hostid', 'ordertype'])
	.alias('env', 'environment')
	.alias('h', 'hostid')
	.alias('o', 'ordertype')
	.alias('ent', 'entity')
	.alias('s', 'startdate')
	.alias('e', 'enddate')
	.alias('f', 'filename')
	.describe('env', 'Specify the environment to use, usually \'testing\' or \'production\'')
	.describe('o', 'Specify the EBICS order type to use')
	.describe('h', 'Specify the EBICS hostId to use')
	.describe('ent', 'Specify the entity to use')
	.describe('s', 'Specify the start date for the download in yyyy-mm-dd format')
	.describe('e', 'Specify the end date for the download in yyyy-mm-dd format')
	.describe('f', 'Specify the filename to upload')
	.argv

	//Define all command line parameters as globals so we can use them from other files as well.
	global.entity = argv.entity || ""
	global.environment = argv.environment || process.env.NODE_ENV;
	global.hostid = argv.hostid || "testbank";
	global.ordertype = argv.ordertype || "";
	global.startdate = argv.startdate || null;
	global.enddate = argv.enddate || null;
	global.filename = argv.filename || "";

	const loadConfig = (configDirectory = path.join(__dirname, './config')) => {
	global.entity ? console.log(`Loading config from ${configDirectory} with env set to `+global.environment+`, bank set to `+global.hostid+` and entity set to `+global.entity) : console.log(`Loading config from ${configDirectory} with env set to `+global.environment+` and bank set to `+global.hostid);

	const baseConfigFile = path.join(configDirectory, 'config.json');
	const envConfigFile = global.environment ? global.entity ? path.join(configDirectory, `config.`+global.environment+`.`+global.hostid+`.`+global.entity+`.json`) : path.join(configDirectory, `config.`+global.environment+`.`+global.hostid+`.json`) : null;

	return {
		...safeLoadJson(baseConfigFile),
		...safeLoadJson(envConfigFile),
	}
}

module.exports = loadConfig;
