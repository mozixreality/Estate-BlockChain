SHELL := /bin/bash
.PHONY: help init new-account start-geth start-frontend start-backend start-zookeeper start-kafka start-kafka-connect deploy-kafka-connect list-kafka-topics listen-topic
.DEFAULT: help

BLOCK_DATA=data
NETWORK_ID=20220411 
ACCOUNT_PASSWD=Abcd1234

help:
	@echo "make init: create a new private chain"
	@echo "make new-account: create a new block chain account"
	@echo "make start-geth: start your private chain"
	@echo "make migrate: migrate contract with truffle (must start geth first)"
	@echo "make start-frontend: start your frontend server"
	@echo "make start-backend: start your backend server"
	@echo "make start-zookeeper: start zookeeper server"
	@echo "make start-kafka: start kafka server"
	@echo "make start-kafka-connect: start kafka connect with plugin mysql debezium"
	@echo "make deploy-kafka-connect: deploy kafka connect with RESTful API"
	@echo "make list-kafka-topics: list kafka topics"
	@echo "make listen-topic: listen certain kafka topic"

init:
	geth --datadir $(BLOCK_DATA) init genesis.json

new-account:
ifdef passwd
	geth account new --datadir $(BLOCK_DATA) --password <(echo $(passwd))
else
	geth account new --datadir $(BLOCK_DATA) --password <(echo $(ACCOUNT_PASSWD))
endif

migrate:
ifdef env
	truffle migrate --reset --network $(env)
else
	truffle migrate --reset --network development
endif

start-geth:
	geth --datadir $(BLOCK_DATA) --networkid $(NETWORK_ID) \
	--ws --ws.port 8546 --ws.origins "*" \
	--http --http.corsdomain "*" --nodiscover \
	--http.api="eth,web3,net,personal,admin,txpool,miner,personal" \
	--allow-insecure-unlock --unlock "0" --password <(echo $(ACCOUNT_PASSWD)) \
	--miner.gasprice '0' \
	console

start-backend:
	cd client/src/backend && node server.js
# > /dev/null 2>&1 &

start-frontend:
	cd client && npm start
# > /dev/null 2>&1 &

start-zookeeper:
	~/kafka/bin/zookeeper-server-start.sh ~/kafka/config/zookeeper.properties 
# > /dev/null 2>&1 &

start-kafka:
	~/kafka/bin/kafka-server-start.sh ~/kafka/config/server.properties 
# > /dev/null 2>&1 &

start-kafka-connect:
	~/kafka/bin/connect-distributed.sh ~/kafka/config/my-kafka-connect.properties 
# > /dev/null 2>&1 &

deploy-kafka-connect:
	curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d '{"name": "estate_blockchain-connector", "config": {"connector.class": "io.debezium.connector.mysql.MySqlConnector", "tasks.max": "1", "database.hostname": "localhost", "database.port": "3306", "database.user": "mozixreality", "database.password": "ylsh510574", "database.server.id": "6666", "database.server.name": "KafkaConnectTopic", "database.history.kafka.topic": "schema-changes", "database.history.kafka.bootstrap.servers": "localhost:9092", "poll.interval.ms": "1000"}}'

list-kafka-topics:
	~/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

listen-topic:
ifdef topic
	~/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic $(topic) --from-beginning
else
	~/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic KafkaConnectTopic.estate_blockchain.event_list --from-beginning
endif	