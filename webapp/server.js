// Author: Pham Bao Huy

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'luongd';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// Web components
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/api/verify', urlencodedParser, async function(req, res) {
	try {
		// init
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		const wallet = await buildWallet(Wallets, walletPath);

		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);

			console.log('Received verification request: ');
			console.log('DegreeID =', req.body.degreeID);
			console.log('InternID =', req.body.internID);
			console.log('Owner =', req.body.owner);

			try {
				let result = await contract.evaluateTransaction('VerifyOC', req.body.degreeID, req.body.internID, req.body.owner);
				console.log('Returned from smart contract:', result.toString());
				if (result.toString() == 'true') res.send('valid');
				else res.send('invalid');
			} catch (err) {
				console.log(err);
				res.send('error');
			};
		} finally {
			// close connections to the network
			gateway.disconnect();
		}

	} catch (error) {
		console.log(`FAILED to run: ${error}`);
	}
});

app.get('/degrees', async function(req, res) {
	try {
		// init
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		const wallet = await buildWallet(Wallets, walletPath);

		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);

			console.log('\n--> Evaluate Transaction: GetAllDegrees, function returns all the current degrees on the ledger');
			let result = await contract.evaluateTransaction('GetAllDegrees');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			res.render('degrees', {degreeList: JSON.parse(result)});

		} finally {
			// close connections to the network
			gateway.disconnect();
		}

	} catch (error) {
		console.log(`FAILED to run: ${error}`);
	}
});

async function init() {
	const ccp = buildCCPOrg1();
	const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
	const wallet = await buildWallet(Wallets, walletPath);
	await enrollAdmin(caClient, wallet, mspOrg1);
	await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
}

app.listen(2905, () => {
	init();
	console.log("Finishing initialization...");
	console.log("Listen on port 2905!");
});
