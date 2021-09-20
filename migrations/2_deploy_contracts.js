var Election = artifacts.require("./Election.sol");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Election);
  const election = await Election.deployed();
};
