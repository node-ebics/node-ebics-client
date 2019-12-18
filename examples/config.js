const _ = require('lodash');

const ebics = require('../index');
const config = require('./config.json');
var myArgs = process.argv.slice(2);
//We can run this script with an argument. I.e. "testing" or "production" and it will load the corresponding configuration values for the corresponding environment from config.json
const whichEnvironment = myArgs[0].trim().toLowerCase();
const defaultConfig = config.testing;
//We default back to test in case whichEnvironment argument is not passed while running the script, so we don't accidentally end up making changes in production.
const environment = whichEnvironment || 'testing';
const environmentConfig = config[environment];
if (!environmentConfig) {
	console.log("ERROR! Could not find configuration for \""+whichEnvironment+"\" using configuration for \"testing\" instead");
}

global.gFinalConfig = _.merge(defaultConfig, environmentConfig);

global.gClient = new ebics.Client({
	url: gFinalConfig.serverAddress,
	partnerId: gFinalConfig.partnerId,
	userId: gFinalConfig.userId,
	hostId: gFinalConfig.hostId,
	passphrase: gFinalConfig.passphrase, // keys-test will be encrypted with this passphrase
	keyStorage: ebics.fsKeysStorage(gFinalConfig.keyStorage),
});
