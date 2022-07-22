# Estate Blockchain
## Getting Start
1. Going into client directory and try the following command
```bash
npm install --force
```
> If you facing the problem that **Create React App requires a dependency: "babel-loader": "8.1.0"**. Try to create a **.env** file in your client directory and add **SKIP_PREFLIGHT_CHECK=true** in it. Then restart your react server

## MySQL Server
1. open mysql server with the following command, then type your root password.
```
mysql -u root -p
```
2. using SQL console and type the following command
```
CREATE DATABASE estate_blockchain;
```
3. back to your terminal and import the sql file like
```
mysql -u root -p estate_blockchain < sql/estate_blockchain.sql
```

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
### Geth Command Introduce
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


# https://debezium.io/documentation/reference/1.1/tutorial.html#starting-kafka-connect
if kafka connect does not work perfectly, please check the error message and the kafka settings to solve the problem