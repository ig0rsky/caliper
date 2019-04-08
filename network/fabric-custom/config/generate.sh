#!/usr/bin/env bash

# Prior to generation, need to run:
# export FABRIC_CFG_PATH=<path to directory>
export FABRIC_CFG_PATH=/Users/ak/caliper/network/fabric-custom/config

# The below assumes you have the relevant code available to generate the cryto-material
cryptogen generate --config=./crypto-config.yaml
configtxgen -profile OrgsOrdererGenesis -outputBlock orgs.genesis.block -channelID mychannel
configtxgen -profile OrgsChannel -outputCreateChannelTx mychannel.tx -channelID mychannel

# Rename the key files we use to be key.pem instead of a uuid
for KEY in $(find crypto-config -type f -name "*_sk"); do
    KEY_DIR=$(dirname ${KEY})
    mv ${KEY} ${KEY_DIR}/key.pem
done
