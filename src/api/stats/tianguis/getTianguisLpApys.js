const BigNumber = require("bignumber.js");
const { bscWeb3: web3 } = require("../../../utils/web3");

const tianguisAbi = require("../../../abis/Tianguis.json");
const fetchPrice = require("../../../utils/fetchPrice");
const pools = require("../../../data/tianguisLpPools.json");
const { compound } = require("../../../utils/compound");
const { getTotalLpStakedInUsd } = require("../../../utils/getTotalStakedInUsd");
const { BASE_HPY, BSC_CHAIN_ID } = require("../../../../constants");
const getBlockNumber = require("../../../utils/getBlockNumber");

const getTianguisLpApys = async () => {
  let apys = {};
  const ElTianguis = "0xFd0Dd713048E911630A7dB824857637d31A675b7";

  let promises = [];
  pools.forEach((pool) => promises.push(getPoolApy(ElTianguis, pool)));
  const values = await Promise.all(promises);

  for (item of values) {
    apys = { ...apys, ...item };
  }

  return apys;
};

const getPoolApy = async (gangster, pool) => {
  const [yearlyRewardsInUsd, totalStakedInUsd] = await Promise.all([
    getYearlyRewardsInUsd(gangster, pool),
    getTotalLpStakedInUsd(gangster, pool),
  ]);
  const simpleApy = yearlyRewardsInUsd.dividedBy(totalStakedInUsd);
  const apy = compound(simpleApy, BASE_HPY, 1, 0.94);
  return { [pool.name]: apy };
};

const getYearlyRewardsInUsd = async (ElTianguis, pool) => {
  const blockNum = await getBlockNumber(BSC_CHAIN_ID);
  const tianguisContract = new web3.eth.Contract(tianguisAbi, ElTianguis);

  const multiplier = new BigNumber(
    await tianguisContract.methods.getMultiplier(blockNum - 1, blockNum).call()
  );
  const blockRewards = new BigNumber(
    await tianguisContract.methods.morrallaPerBlock().call()
  );

  let { allocPoint } = await tianguisContract.methods
    .poolInfo(pool.poolId)
    .call();
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
  const yearlyRewards = poolBlockRewards
    .dividedBy(secondsPerBlock)
    .times(secondsPerYear);

  const morrallaPrice = await fetchPrice({
    oracle: "tokens",
    id: "MORRALLA",
  });
  const yearlyRewardsInUsd = yearlyRewards.times(morrallaPrice).dividedBy("1e18");

  return yearlyRewardsInUsd;
};

module.exports = getTianguisLpApys;
