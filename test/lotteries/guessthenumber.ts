import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";


describe("guessthenumber", function() {
    it("Should solve the guess the number challenge", async function() {
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];

        const factory = await ethers.getContractFactory("GuessTheNumberChallenge");
        let target = factory.attach('0x517ffea18ED53279811E04342a8833551bFEeeb6');
        let payval = { value: ethers.utils.parseEther('1') };
        
        const tx = await target.guess(42, payval);
        expect(tx.hash).to.not.be.undefined;
        console.log(tx);
    });
});