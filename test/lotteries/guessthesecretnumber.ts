import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";


describe("guessthesecretnumber", function() {
    it("Should solve the guess the secret number challenge", async function() {
        let target_hash = '0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365';
        let answer = 0;
 
        /*
        * bruteforce keccack256 hash (uint8 is a bad seed)
        */
        for (let i = 0; i < 256; i++) {
            if (ethers.utils.keccak256([i]) === target_hash) {
                answer = i;
                break;
            }
        }

        console.log("Correct guess should be: " + answer);

        let accounts = await ethers.getSigners();
        let eoa = accounts[0];

        const factory = await ethers.getContractFactory("GuessTheSecretNumberChallenge");
        let target = factory.attach('0x72786abEaB13e150eB682B9406E7d1ddE4a4B7A9');
        let payval = { value: ethers.utils.parseEther('1') };
        
        const tx = await target.guess(answer, payval);
        expect(tx.hash).to.not.be.undefined;
        tx.wait();
        console.log(tx);
    });
});