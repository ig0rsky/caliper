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
    let fs = require('fs');
    let path = require('path');
    const util = require('../../src/comm/util');
    const logger = util.getLogger('query.js');
    let acc_num = accounts[Math.floor(Math.random() * (accounts.length))];
    if (bc.bcType === 'fabric-ccp') {
        let args = {
            chaincodeFunction: 'query',
            chaincodeArguments: [acc_num.toString()],
        };
        let txStatusPromise = bc.bcObj.querySmartContract(contx, 'smallbank', '1.0', args, 3);
        let outputJson = path.join(process.cwd(), 'transactions.json');
        txStatusPromise.then((txStatuses) => {
            // logger.info(JSON.stringify(txStatuses, null, 2));
            fs.appendFile(outputJson, JSON.stringify(txStatuses, null, 2), (err) => {
                if (err) {
                    throw err;
                }
            });
        }).catch((error) => {
            logger.info(error);
        })
        return txStatusPromise;
    } else {
        // NOTE: the query API is inconsistent with the invoke API
        let txStatusPromise = bc.queryState(contx, 'smallbank', '1.0', acc_num);
        let outputJson = path.join(process.cwd(), 'smallbank_query_tx.json');
        txStatusPromise.then((txStatuses) => {
            // logger.info(JSON.stringify(txStatuses, null, 2));
            fs.appendFile(outputJson, JSON.stringify(txStatuses, null, 2), (err) => {
                if (err) {
                    throw err;
                }
            });
        }).catch((error) => {
            logger.info(error);
        })
        return txStatusPromise;
    }
};

module.exports.end = function () {
    // do nothing
    return Promise.resolve();
};
