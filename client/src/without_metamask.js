let Web3 = require('web3')

// export async function Sign(){
    let web3 = new Web3("http://localhost:8000");

    web3.eth.personal.getAccounts()
        .then((acc) => {
            let account = acc[0];
            let to = acc[1];

            web3.eth.getTransactionCount(account)
                .then(txCount => {
                    let newNonce = web3.utils.toHex(txCount);
                    console.log(newNonce);
                    web3.eth.getGasPrice()
                        .then((gasPrice) => {
                            let txParams = {
                                nonce: newNonce,
                                from: account,
                                to: "0x5f42A94cf5C16e0596F10e1520411A2C3bD153a0",
                                gas: '0x7530',
                                gasPrice: gasPrice,
                                value: '0x11',

                            }
                            console.log(txParams)

                    web3.eth.signTransaction(txParams)
                        .then(signedTx => web3.eth.sendSignedTransaction(signedTx.raw))
                        .then(receipt => console.log("Transaction receipt:", receipt))
                        .catch(err => console.error(err));
                    });
            });
    });

// }