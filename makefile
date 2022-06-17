SHELL := /bin/bash
.PHONY: help init new-account start-geth start-frontend start-backend start-zookeeper start-kafka
.DEFAULT: help

BLOCK_DATA=data
NETWORK_ID=20220411 
ACCOUNT_PASSWD=Abcd1234

help:
	@echo "make init: create a new private chain"
	@echo "make new-account: create a new block chain account"
	@echo "make migrate: migrate contract with truffle (must start geth first)"
	@echo "make start-geth: start your private chain"
	@echo "make start-frontend: start your frontend server"
	@echo "make start-backend: start your backend server"
	@echo "make start-zookeeper: start zookeeper server"
	@echo "make start-kafka: start kafka server"

init:
	geth --datadir $(BLOCK_DATA) init genesis.json

new-account:
ifdef passwd
	geth account new --password <(echo $(passwd))
else
	geth account new --password <(echo $(ACCOUNT_PASSWD))
endif

migrate:
ifdef env
	truffle migrate --reset --network $(env)
else
	truffle migrate --reset --network development
endif


start-geth:
	geth --datadir $(BLOCK_DATA) --networkid $(NETWORK_ID) \
	--ws --wsport 8546 --wsorigins "*" \
	--rpc --rpccorsdomain "*" --nodiscover \
	--rpcapi="eth,web3,net,personal,admin,txpool,miner,db,personal" \
	--unlock "0" --password <(echo $(ACCOUNT_PASSWD)) \
	--miner.gasprice '0' \
	console

start-backend:
	cd client/src/backend && node server.js

start-frontend:
	cd client && npm start

start-zookeeper:
	~/kafka/bin/zookeeper-server-start.sh ~/kafka/config/zookeeper.properties

start-kafka:
	~/kafka/bin/kafka-server-start.sh ~/kafka/config/server.properties