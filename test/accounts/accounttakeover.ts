import { ethers } from "hardhat";
import { expect } from "chai";

describe("accounttakeover", function() {
    it("should solve account takeover challenge", async function() {
        this.timeout(0);

        const targetABI = [
            "function authenticate() public",
        ];
        const targetAddr = "0x759F30804C6313fcFC4120F03CcAcDa4EB867bfb";

        const signers = await ethers.getSigners();
        const eoa = signers[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));

        // two transaction signed with same r
        const tx1Hash = "0xd79fc80e7b787802602f3317b7fe67765c14a7d40c3e0dcb266e63657f881396";
        const tx2Hash = "0x061bf0b4b5fdb64ac475795e9bc5a3978f985919ce6747ce2cfbbcaccaf51009";

        const tx1 = await eoa.provider!.getTransaction(tx1Hash);
        const tx2 = await eoa.provider!.getTransaction(tx2Hash);

        console.log(tx1);
        console.log(tx2);

        expect(tx1.r!).to.be.eq(tx2.r!);

        const tx1Raw = {
            nonce: tx1.nonce,
            gasPrice: tx1.gasPrice,
            gasLimit: tx1.gasLimit,
            to: tx1.to,
            value: tx1.value,
            data: tx1.data,
            chainId: tx1.chainId,
        }
        const tx2Raw = {
            nonce: tx2.nonce,
            gasPrice: tx2.gasPrice,
            gasLimit: tx2.gasLimit,
            to: tx2.to,
            value: tx2.value,
            data: tx2.data,
            chainId: tx2.chainId,
        }

        let signData = ethers.utils.serializeTransaction(tx1Raw);
        const z1 = ethers.utils.keccak256(signData);
        signData = ethers.utils.serializeTransaction(tx2Raw);
        const z2 = ethers.utils.keccak256(signData);

        console.log("r: " + tx1.r!);
        console.log("s1: " + tx1.s!);
        console.log("z1: " + z1);
        console.log("s2: " + tx2.s!);
        console.log("z2: " + z2);

        /* using test/accounts/priv_key_recover.py
         * gives two possible private keys
         * 614f5e36cd55ddab0947d1723693fef5456e5bee24738ba90bd33c0c6e68e269
         * 973985b7581c9276cceb6ea6bdf7c76f010eb9f06c0e3f3cd62c36a201081234 
         */

        const privk1= "0x614f5e36cd55ddab0947d1723693fef5456e5bee24738ba90bd33c0c6e68e269";
        const privk2 = "0x973985b7581c9276cceb6ea6bdf7c76f010eb9f06c0e3f3cd62c36a201081234";

        const hijackedSigners = [
            new ethers.Wallet(privk1, eoa.provider),
            new ethers.Wallet(privk2, eoa.provider),
        ]

        const ownerAddr = "0x6B477781b0e68031109f21887e6B5afEAaEB002b"; // hardcoded in the target contract;
        let signer = hijackedSigners[0];
        let pkFound = false;
        
        for (let i = 0; i < hijackedSigners.length; i++) {
            if (hijackedSigners[i].address == ownerAddr) {
                console.log("Private key found: " + signer.privateKey);
                signer = hijackedSigners[i];
                pkFound = true;
                break;
            } 
        }
        expect(pkFound).to.be.true;

        // luckily the wallet has enough balance for gas in my case. No need to sending ether for gas fee. 
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let target = contract.connect(signer);

        let tx = await target.authenticate();
        tx.wait();
        console.log(tx);

    });
});