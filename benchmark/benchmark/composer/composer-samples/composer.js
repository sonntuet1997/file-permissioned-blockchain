/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*  Basic Sample Network
*  Updates the value of an Asset through a Transaction.
*  - Example test round (txn <= testAssets)
*      {
*        "label" : "basic-sample-network",
*        "txNumber" : [50],
*        "trim" : 0,
*        "rateControl" : [{"type": "fixed-rate", "opts": {"tps" : 10}}],
*        "arguments": {"testAssets": 50},
*        "callback" : "benchmark/composer/composer-samples/basic-sample-network.js"
*      }
*  - Init:
*    - Single Participant created (PARTICIPANT_0)
*    - Test specified number of Assets created, belonging to a PARTICIPANT_0
*  - Run:
*    - Transactions run against all created assets to update their values
*
*/

'use strict';

module.exports.info  = 'Basic Sample Network Performance Test';

const composerUtils = require('../../../src/composer/composer_utils');
const removeExisting = require('../composer-test-utils').clearAll;
const logger = require('../../../src/comm/util').getLogger('composer.js');
const os = require('os');

const namespace = 'sm.vn';
const busNetName = 'composer';
const uuid = os.hostname() + process.pid; // UUID for client within test

let bc;                 // The blockchain main (Composer)
let busNetConnections;  // Global map of all business network connections to be used
let testAssetNum;       // Number of test assets to create
let factory;            // Global Factory

module.exports.init = async function(blockchain, context, args) {
    // Create Participants and Assets to use in main test
    bc = blockchain;
    busNetConnections = new Map();
    busNetConnections.set('admin', context);
    testAssetNum = args.testAssets;

    // let assetRegistry = await busNetConnections.get('admin').getAssetRegistry(namespace + '.History');
    // let assets = Array();

    try {
        factory = busNetConnections.get('admin').getBusinessNetwork().getFactory();
        // // Create Test Assets
        // for (let i=0; i<testAssetNum; i++) {
        //     let asset = factory.newResource(namespace, 'History', 'ASSET_' + uuid + '_' + i);
        //     asset.question_id = uuid + '_' + i;
        //     asset.current_answer = ["2131"];
        //     asset.code = 9.15;
        //     asset.status = [9.15];
        //     asset.comment = "abc";
        //     asset.date = new Date();
        //     asset.createAt = new Date();
        //     asset.updateAt = new Date();
        //     asset.answer_right = 1;
        //     asset.assignment_id = uuid + '_' + i;
        //     asset.in_time = 2;
        //     assets.push(asset);
        // }
        // // Conditionally add/update Test Assets
        // let populated = await assetRegistry.exists(assets[0].getIdentifier());
        // if (!populated) {
        //     logger.debug('Adding test assets ...');
        //     await assetRegistry.addAll(assets);
        //     logger.debug('Asset addition complete ...');
        // } else {
        //     logger.debug('Updating test assets ...');
        //     await removeExisting(assetRegistry, 'ASSET_' + uuid);
        //     await assetRegistry.addAll(assets);
        //     logger.debug('Asset update complete ...');
        // }
    } catch (error) {
        logger.error('error in test init(): ', error);
        return Promise.reject(error);
    }
};

module.exports.run = function(i) {
        let transaction = factory.newTransaction("transaction.sm.vn", 'CreateHistory');
        transaction.uid = uuid + '_' + i;
        transaction.question_id = uuid + '_' + i;
        transaction.current_answer = ["2131"];
        transaction.code = 9.15;
        transaction.status = [9.15];
        transaction.comment = "abc";
        transaction.date = new Date();
        transaction.createAt = new Date();
        transaction.updateAt = new Date();
        transaction.answer_right = 1;
        transaction.assignment_id = uuid + '_' + i;
        transaction.in_time = 2;
        return bc.bcObj.submitTransaction(busNetConnections.get('admin'), transaction);
    // return bc.bcObj.submitTransaction(busNetConnections.get('admin'), transaction);
};

module.exports.end = function() {
    return Promise.resolve(true);
};