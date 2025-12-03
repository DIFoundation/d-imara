import {FundingPoolContract_abi, RewardContract_abi, WalletContract_abi} from "../lib/abi&Address";
import {FundingPoolContract_address, RewardContract_address, WalletContract_address} from "../lib/abi&Address"

export const fundingPoolConfig = {
  address: FundingPoolContract_address as `0x${string}`,
  abi: FundingPoolContract_abi,
} as const;

export const REWARD_CONTRACT = {
  address: RewardContract_address as `0x${string}`,
  abi: RewardContract_abi,
} as const;

export const walletContractConfig = {
    address: WalletContract_address as `0x${string}`,
    abi: WalletContract_abi,
  } as const;
