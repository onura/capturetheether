import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";


describe("nickname", function() {
    it("Should solve the nickname challenge", async function() {
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];

        const factory = await ethers.getContractFactory("CaptureTheEther");
        let target = factory.attach('0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee');

        let nick = ethers.utils.formatBytes32String("ospwner");
        const tx = await target.setNickname(nick);
        expect(tx.hash).to.not.be.undefined;
        console.log(tx);
    });
});