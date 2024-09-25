<p align="center">
	<img src="assets/logo.png" width="300px" height="auto"/>
</p>
<h1 align="center">node-ebics-client</h1>

<p align="center">
<a href="https://travis-ci.org/node-ebics/node-ebics-client" title="Build Status"><img src="https://travis-ci.org/node-ebics/node-ebics-client.svg?branch=master" alt="Build Status" /></a>
<a href="https://www.npmjs.com/package/ebics-client" title="Build Status">
<img alt="ebics-client" src="https://img.shields.io/npm/v/ebics-client">
</a>
<a href="https://snyk.io/test/github/ecollect/node-ebics-client" title="Known Vulnerabilities">
<img src="https://snyk.io/test/github/ecollect/node-ebics-client/badge.svg" alt="Known Vulnerabilities">
</a>
<a href="/eCollect/node-ebics-client/blob/master/LICENSE" title="GPL-3.0"><img alt="GPL-3.0" src="https://img.shields.io/github/license/eCollect/node-ebics-client"></a>
<a href='https://coveralls.io/github/eCollect/node-ebics-client?branch=master' title="Coverage Status"><img src='https://coveralls.io/repos/github/eCollect/node-ebics-client/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

Pure Node.js (>= 16) implementation of [EBICS](https://en.wikipedia.org/wiki/Electronic_Banking_Internet_Communication_Standard) (Electronic Banking Internet Communication).

The client is aimed to be 100% [ISO 20022](https://www.iso20022.org) compliant, and supports the complete initializations process (INI, HIA, HPB orders) and HTML letter generation.

## Usage

For examples on how to use this library, take a look at the [examples](https://github.com/node-ebics/node-ebics-client/tree/master/examples).

### A note on recent Node.js versions

The latest Node.js versions don't support `RSA_PKCS1_PADDING` for private decryption for security reasons, throwing an error like _TypeError: RSA_PKCS1_PADDING is no longer supported for private decryption, this can be reverted with --security-revert=CVE-2023-46809_.

EBICS requires this mode, so in order for this library to work, add the following parameter when starting Node.js: `--security-revert=CVE-2023-46809`

### Initialization

1. Create a configuration (see [example configs](https://github.com/node-ebics/node-ebics-client/tree/master/examples/config)) with the EBICS credentials you received from your bank and name it in this schema: `config.<environment>.<bank>[.<entity>].json` (the entity is optional).

    - The fields `url`, `partnerId`, `userId`, `hostId` are provided by your bank.
    - The `passphrase` is used to encrypt the keys file, which will be stored at the `storageLocation`.
    - The `bankName` and `bankShortName` are used internally for creating files and identifying the bank to you.
    - The `languageCode` is used when creating the Initialization Letter and can be either `de`, `en`, or `fr`.
    - You can chose any environment, bank and, optionally, entity name. Entities are useful if you have multiple EBICS users for the same bank account.

2. Run `node examples/initialize.js <environment> <bank> [entity]` to generate your key pair and perform the INI and HIA orders (ie. send the public keys to your bank)  
   The generated keys are stored in the file specified in your config and encrypted with the specified passphrase.
3. Run `node examples/bankLetter.js <environment> <bank> [entity]` to generate the Initialization Letter
4. Print the letter, sign it and send it to your bank. Wait for them to activate your EBICS account.
5. Download the bank keys by running `node examples/save-bank-keys.js <environment> <bank> [entity]`

If all these steps were executed successfully, you can now do all things EBICS, like fetching bank statements by running `node examples/send-sta-order.js <environment> <bank> [entity]`, or actually use this library in your custom banking applications.

## Supported Banks

The client is currently tested and verified to work with the following banks:

-   [Credit Suisse (Schweiz) AG](https://www.credit-suisse.com/ch/en.html)
-   [Zürcher Kantonalbank](https://www.zkb.ch/en/lg/ew.html)
-   [Raiffeisen Schweiz](https://www.raiffeisen.ch/rch/de.html)
-   [BW Bank](https://www.bw-bank.de/de/home.html)
-   [Bank GPB International S.A.](https://gazprombank.lu/e-banking)
-   [Bank GPB AO](https://gazprombank.ru/)
-   [J.P. Morgan](https://www.jpmorgan.com/)

## Inspiration

The basic concept of this library was inspired by the [EPICS](https://github.com/railslove/epics) library from the Railslove Team.

## Copyright

Copyright: Dimitar Nanov, 2019-2022.  
Licensed under the [MIT](LICENSE) license.
