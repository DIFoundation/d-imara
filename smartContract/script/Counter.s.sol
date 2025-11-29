// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract CounterScript is Script {
    Counter public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new Counter();

        vm.stopBroadcast();
    }
}


// require("@nomicfoundation/hardhat-toolbox")
// require("@nomiclabs/hardhat-ethers")
// require("dotenv").config()

// module.exports = {
//   solidity: "0.8.20",
//   networks: {
//     camp: {
//       url: process.env.CAMP_RPC_URL || "https://rpc.camp.io",
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//       chainId: 325000,
//     },
//     hardhat: {
//       allowUnlimitedContractSize: true,
//     },
//   },
//   etherscan: {
//     apiKey: process.env.ETHERSCAN_API_KEY || "",
//   },
// }
