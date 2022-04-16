SHELL := /bin/bash
.PHONY: help start new-account
.DEFAULT: help

BLOCK_DATA=data
NETWORK_ID=20220411 

help:
	@echo "make init: create a new private chain"
	@echo "make start: start your private chain"

init:
	geth --datadir $(BLOCK_DATA) init genesis.json

start:
	geth --datadir $(BLOCK_DATA) --networkid $(NETWORK_ID) \
	--rpc --rpccorsdomain "*" --nodiscover \
	--rpcapi="eth,web3,net,personal,admin,txpool,miner,db,personal" \
	--unlock "0" --password <(echo Abcd1234) \
	console

new-account:
ifdef passwd
	geth account new --password <(echo $(passwd))
else
	@echo "make new-account passwd=<your passwd>"
endif