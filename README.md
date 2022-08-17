# Estate Blockchain
## Required Dependency and Installation
- make, nodejs, npm
	```
	sudo apt install make nodejs npm
	```
- geth
	- [Go ethereum](https://geth.ethereum.org/docs/install-and-build/installing-geth#ubuntu-via-ppas)
- truffle
	```
	sudo npm install -g truffle
	```
- docker mysql & phpmyadmin 
	- [docker](https://docs.docker.com/engine/install/ubuntu/)
	- [mysql & phpmyadmin](https://migueldoctor.medium.com/run-mysql-phpmyadmin-locally-in-3-steps-using-docker-74eb735fa1fc)
	- [[Docker][MySQL]Access denied for user ‘’@’172.17.0.1'(using password: YES)](https://medium.com/tech-learn-share/docker-mysql-access-denied-for-user-172-17-0-1-using-password-yes-c5eadad582d3)
- java
	```
	sudo apt-get install default-jre
	sudo apt-get install default-jdk
	```
- kafka
	1. download kafka (kafka 3.1.0)
		```
		curl https://dlcdn.apache.org/kafka/3.1.0/kafka-3.1.0-src.tgz -o ~/Downloads/kafka.tgz
		```
	2. unzip to kafka directory
		```
		mkdir ~/kafka && cd ~/kafka && tar -xvzf ~/Downloads/kafka.tgz --strip 1
		```
	3. build
		```
		cd ~/kafka && ./gradlew jar -PscalaVersion=2.13.6
		```
- debezium
	- [offical tutorial](https://debezium.io/documentation/reference/1.1/tutorial.html#starting-kafka-connect)
	- [在KafkaConnect中加入Debezium
](https://lmlakai1024.medium.com/%E5%9C%A8kafkaconnect%E4%B8%AD%E5%8A%A0%E5%85%A5debezium-efc8cdb39519)
	- if kafka connect does not work perfectly, please check the error message and the kafka settings to solve the problem
## Getting Start
1. Going into client directory and try the following command
	```bash
	npm install web3 --force
	npm install --force
	```
	> If you facing the problem that **Create React App requires a dependency: "babel-loader": "8.1.0"**. Try to create a **.env** file in your client directory and add **SKIP_PREFLIGHT_CHECK=true** in it. Then restart your react server

## MySQL Server
1. open mysql server with the following command, then type your root password.
	```
	mysql -h 127.0.0.1 -u root -p
	```
2. using SQL console and type the following command
	```
	CREATE DATABASE estate_blockchain;
	```
3. back to your terminal and import the sql file like
	```
	mysql -h 127.0.0.1 -u root -p estate_blockchain < sql/estate_blockchain.sql
	```

## MakeFile
- you can use make file to do even every thing works.
- need to set .env in client directory

## Geth Tips
### Command Introduce
1. Initialize a private chain.
	```bash
	geth --datadir ./data init genesis.json
	```
	- ./data is a directory where your block data stored.
	- genesis.json is the information of your first block

2. start your private chain
	```bash
	geth --datadir ./data --networkid 20220411 
		--ws --wsport 8546 --wsorigins "*"
		--rpc --rpccorsdomain "*" --nodiscover 
		--rpcapi="eth,web3,net,personal,admin,txpool,miner,db,personal" 
		console
	```
3. migrate contract
	```bash
	truffle migrate --network development
	```
	- using development env to deploy the contracts
	- networkid need to same with chainId in genesis.json
	- after you run this command, geth console will start, and you can interact with geth on it.
### Geth Console Command Introduce
1. Add a new accout
	```bash
	personal.newAccount("your password")
	personal.newAccount("Abcd1234")
	```
2. Unlock your accout (account 0) before mining
	```bash
	personal.unlockAccount(eth.accounts[0], "your password", 1000)
	personal.unlockAccount(eth.accounts[0], "Abcd1234", 1000)
	```
3. Set ether base with account 0
	```bash
	miner.setEtherbase(eth.accounts[0])
	```
4. Start mining & stop mining
	```bash
	miner.start()
	miner.stop()
	```
