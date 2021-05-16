pragma solidity ^0.7.4;

import "hardhat/console.sol";

interface IName {
    function name() external view returns (bytes32);
}

contract FuzzyIdentityChallenge {
    bool public isComplete;

    function authenticate() public {
        console.log("authenticate called");
        require(isSmarx(msg.sender));
        console.log("isSmarx ok");
        require(isBadCode(msg.sender));
        console.log("isBadCode ok");
        isComplete = true;
    }

    function isSmarx(address addr) internal view returns (bool) {
        return IName(addr).name() == bytes32("smarx");
    }

    function isBadCode(address _addr) internal pure returns (bool) {
        bytes20 addr = bytes20(_addr);
        bytes20 id = hex"000000000000000000000000000000000badc0de";
        bytes20 mask = hex"000000000000000000000000000000000fffffff";

        for (uint256 i = 0; i < 34; i++) {
            if (addr & mask == id) {
                return true;
            }
            mask <<= 4;
            id <<= 4;
        }

        return false;
    }
}