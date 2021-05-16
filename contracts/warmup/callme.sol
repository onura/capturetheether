pragma solidity ^0.7.4;

contract CallMeChallenge {
    bool public isComplete = false;

    function callme() public {
        isComplete = true;
    }
}