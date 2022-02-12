var CadastralContract = artifacts.require("./CadastralContract.sol");

module.exports = function(deployer) {
  deployer.deploy(CadastralContract);
};
