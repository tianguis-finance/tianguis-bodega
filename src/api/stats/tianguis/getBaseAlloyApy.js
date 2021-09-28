const BigNumber = require('bignumber.js');
const { bscWeb3: web3 } = require('../../../utils/web3');

const ERC20 = require('../../../abis/ERC20.json');
const fetchPrice = require('../../../utils/fetchPrice');
const { getTotalStakedInUsd } = require('../../../utils/getTotalStakedInUsd');
const { BSC_CHAIN_ID } = require('../../../../constants');
const getBlockNumber = require('../../../utils/getBlockNumber');

const ElTianguisAbi = require('../../../abis/ElTianguis.json');
const ElTianguisFarm = "0xFd0Dd713048E911630A7dB824857637d31A675b7";
const MORRALLA
const ORACLE = 'tokens';
const ORACLE_ID = 'MORRALLA'; 

const getBaseMorrallaApy = async () => {
  const yearlyRewardsInUsd = await getYearlyRewardsInUsd(ElTianguisFarm, ORACLE, ORACLE_ID);
  const totalStakedInUsd = await getTotalStakedInUsd(
    ElTianguisFarm,
    MORRALLA,
    ORACLE,
    ORACLE_ID
  );
  return yearlyRewardsInUsd.dividedBy(totalStakedInUsd);
};

const getYearlyRewardsInUsd = async (tianguisAddr, oracle, oracleId) => {
  const fromBlock = await getBlockNumber(BSC_CHAIN_ID);
  const toBlock = fromBlock + 1;
  const tianguisContract = new web3.eth.Contract(ElTianguisAbi, tianguisAddr);

  const multiplier = new BigNumber(
    await tianguisContract.methods.getMultiplier(fromBlock, toBlock).call()
  );
  const blockRewards = new BigNumber(await tianguisContract.methods.morrallaPerBlock().call());

  let { allocPoint } = await tianguisContract.methods.poolInfo(0).call();
  allocPoint = new BigNumber(allocPoint);

  const totalAllocPoint = new BigNumber(
    await tianguisContract.methods.totalAllocPoint().call()
  );
  const poolBlockRewards = blockRewards
    .times(multiplier)
    .times(allocPoint)
    .dividedBy(totalAllocPoint);

  const secondsPerBlock = 3;
  const secondsPerYear = 31536000;
  const yearlyRewards = poolBlockRewards.dividedBy(secondsPerBlock).times(secondsPerYear);

  const morrallaPrice = await fetchPrice({ oracle, id: oracleId });
  const yearlyRewardsInUsd = yearlyRewards.times(morrallaPrice).dividedBy('1e18');

  return yearlyRewardsInUsd;
};

module.exports = getBaseMorrallaApy;
