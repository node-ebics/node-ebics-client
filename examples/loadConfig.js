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

const getDefaultEnv = () => {
	const [,,parArg] = process.argv;
	return parArg || process.env.NODE_ENV;
}

const getBankIdentifier = () => {
	const [,,,parArg] = process.argv;
	return parArg || "testbank";
}

const getEntityIdentifier = () => {
	const [,,,,parArg] = process.argv;
	return parArg || ""
}

const loadConfig = (configDirectory = path.join(__dirname, './config'), env = getDefaultEnv(), bank = getBankIdentifier(), entity = getEntityIdentifier()) => {
	entity ? console.log(`Loading config from ${configDirectory} with env set to ${env}, bank set to ${bank} and entity set to ${entity}.`) : console.log(`Loading config from ${configDirectory} with env set to ${env} and bank set to ${bank}.`);

	global.entity = entity;
	const baseConfigFile = path.join(configDirectory, 'config.json');
	const envConfigFile = env ? entity ? path.join(configDirectory, `config.${env}.${bank}.${entity}.json`) : path.join(configDirectory, `config.${env}.${bank}.json`) : null;

	return {
		...safeLoadJson(baseConfigFile),
		...safeLoadJson(envConfigFile),
	}
}

module.exports = loadConfig;
