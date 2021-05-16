import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";


describe("callme", function() {
    it("Should solve the callme challenge", async function() {
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        console.log(ethers.utils.formatEther(await eoa.getBalance()));

        const factory = await ethers.getContractFactory("CallMeChallenge");
        let target = factory.attach('0xc66964E28CC42827f8cEEDBC6C76a44D8ff6c20d');

        const tx = await target.callme();
        expect(tx.hash).to.not.be.undefined;
        console.log(tx);
    });
});