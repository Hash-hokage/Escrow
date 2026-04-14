//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Escrow} from "../src/Escrow.sol";
import {console} from "forge-std/Test.sol";

contract DeployEscrow is Script {
    function run() external returns(Escrow) {
        vm.startBroadcast();
        Escrow escrow = new Escrow();
        vm.stopBroadcast();
        console.log("Escrow deployed at:", address(escrow));
        return escrow;
    }
}