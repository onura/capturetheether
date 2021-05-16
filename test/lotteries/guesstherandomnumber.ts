import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";


describe("guesstherandomnumber", function() {
    it("Should solve the guess the random number challenge", async function() {

        let accounts = await ethers.getSigners();
        let eoa = accounts[0];

        const factory = await ethers.getContractFactory("GuessTheSecretNumberChallenge");
        let target = factory.attach('0x37d417815197d0E4982e5325CF73c5C1E8D7afB9');

        let storage0 = await target.provider.getStorageAt(target.address, 0);
        let answer = ethers.BigNumber.from(storage0);
        expect(answer).to.be.within(0, 255);

        console.log("Correct guess should be: " + answer);

        let payval = { value: ethers.utils.parseEther('1') };
        const tx = await target.guess(answer, payval);
        expect(tx.hash).to.not.be.undefined;
        console.log(tx);
    });
});