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

const loadConfig = (configDirectory = path.join(__dirname, './config'), env = getDefaultEnv()) => {
	console.log(`Loading config form ${configDirectory} with env set to ${env}.`);

	const baseConfigFile = path.join(configDirectory, 'config.json');
	const envConfigFile = env ? path.join(configDirectory, `config.${env}.json`) : null;

	return {
		...safeLoadJson(baseConfigFile),
		...safeLoadJson(envConfigFile),
	}
}

module.exports = loadConfig();
