/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
*/

'use strict';

module.exports.info = 'querying accounts';


let bc, contx;
let accounts;
module.exports.init = function (blockchain, context, args) {
    let acc = require('./smallbankOperations.js');
    bc = blockchain;
    contx = context;
    accounts = acc.account_array;
    return Promise.resolve();
};

module.exports.run = function () {
    const util = require('../../src/comm/util');
    const logger = util.getLogger('query.js');
    let acc_num = accounts[Math.floor(Math.random() * (accounts.length))];
    if (bc.bcType === 'fabric-ccp') {
        let args = {
            chaincodeFunction: 'query',
            chaincodeArguments: [acc_num.toString()],
        };
        let txStatusPromise = bc.bcObj.querySmartContract(contx, 'smallbank', '1.0', args, 3);
        txStatusPromise.then((txStatuses) => {
            // logger.info(JSON.stringify(txStatuses, null, 2));
            util.appendToFile('smallbank_query_tx.json', txStatuses);
        }).catch((error) => {
            logger.error(error);
        })
        return txStatusPromise;
    } else {
        // NOTE: the query API is inconsistent with the invoke API
        let txStatusPromise = bc.queryState(contx, 'smallbank', '1.0', acc_num);
        txStatusPromise.then((txStatuses) => {
            // logger.info(JSON.stringify(txStatuses, null, 2));
            util.appendToFile('smallbank_query_tx.json', txStatuses);
        }).catch((error) => {
            logger.error(error);
        });
        return txStatusPromise;
    }
};

module.exports.end = function () {
    // do nothing
    return Promise.resolve();
};
