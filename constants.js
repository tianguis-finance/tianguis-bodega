const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const BSC_CHAIN_ID = 56;

// commented out rpcs for now untill we test.

const MAINNET_BSC_RPC_ENDPOINTS = [
  // 'http://62.182.80.3',
  // 'https://bsc-dataseed2.defibit.io',
  // 'https://bsc-dataseed3.defibit.io',
  // 'https://bsc-dataseed4.defibit.io',
  // 'https://bsc-dataseed1.defibit.io',
  // 'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',
  // 'https://bsc-dataseed2.ninicoin.io',
  // 'https://bsc-dataseed3.ninicoin.io',
  // 'https://bsc-dataseed4.ninicoin.io',
  // 'https://bsc-dataseed1.ninicoin.io',
];

const CUSTOM_BSC_RPC_ENDPOINTS = [
  process.env.BSC_RPC_3,
  process.env.BSC_RPC_2,
  process.env.BSC_RPC,
].filter(item => item);

const BSC_RPC_ENDPOINTS = CUSTOM_BSC_RPC_ENDPOINTS.length
  ? CUSTOM_BSC_RPC_ENDPOINTS
  : MAINNET_BSC_RPC_ENDPOINTS;
const BSC_RPC = BSC_RPC_ENDPOINTS[0];

const BASE_HPY = 2190;
const HOURLY_HPY = 8760;
const DAILY_HPY = 365;
const WEEKLY_HPY = 52;

module.exports = {
  API_BASE_URL,
  BSC_RPC,
  BSC_RPC_ENDPOINTS,
  BSC_CHAIN_ID,
  BASE_HPY,
  HOURLY_HPY,
  DAILY_HPY,
  WEEKLY_HPY,
};
