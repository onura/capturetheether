import { ethers } from "hardhat";
import { expect } from "chai";


describe("guessthenewnumber", function() {
    it("Should solve the guess the new number challenge", async function() {
        this.timeout(0);
        
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];

        const factory = await ethers.getContractFactory("GuessTheNewNumberProxy");
        const proxyCont = await factory.deploy();
        console.log("Malicious contract deployed");

        let payval = { value: ethers.utils.parseEther('1') };
        const tx = await proxyCont.attack('0x82e3B135dC4476Af6874Eff5cBce7F320CBA4Bda', payval);
        expect(tx.hash).to.not.be.undefined;
        console.log(tx);
    });
});