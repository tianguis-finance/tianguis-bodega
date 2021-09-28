const { bscWeb3: web3 } = require('./web3');
const ERC20Abi = require('../abis/ERC20.json');

const getBalance = async (tokenContract, address) => {
  const contract = new web3.eth.Contract(ERC20Abi, tokenContract);
  const balance = await contract.methods.balanceOf(address).call();

  return balance;
};

module.exports = { getBalance };
