SHELL := /bin/bash
.PHONY: help init new-account start-geth start-frontend start-backend
.DEFAULT: help

BLOCK_DATA=data
NETWORK_ID=20220411 
ACCOUNT_PASSWD=Abcd1234

help:
	@echo "make init: create a new private chain"
	@echo "make new-account: create a new block chain account"
	@echo "make start-geth: start your private chain"
	@echo "make start-frontend: start your frontend server"
	@echo "make start-backend: start your backend server"

init:
	geth --datadir $(BLOCK_DATA) init genesis.json

new-account:
ifdef passwd
	geth account new --password <(echo $(passwd))
else
	geth account new --password <(echo $(ACCOUNT_PASSWD))
endif

start-geth:
	geth --datadir $(BLOCK_DATA) --networkid $(NETWORK_ID) \
	--ws --wsport 8546 --wsorigins "*" \
	--rpc --rpccorsdomain "*" --nodiscover \
	--rpcapi="eth,web3,net,personal,admin,txpool,miner,db,personal" \
	--unlock "0" --password <(echo $(ACCOUNT_PASSWD)) \
	--miner.gasprice '0' \
	console

start-frontend:
	cd client && npm start

start-backend:
	cd client/src && node server2.js
