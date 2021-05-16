import { ethers } from "hardhat";
import { expect } from "chai";



describe("publickey", function() {
    it("Should solve the publickey challenge.", async function() {
        this.timeout(0);

        const targetABI = [ 
            "function authenticate(bytes publicKey) public",
        ];
        const targetAddr = "0xFdc245ba0F12f8918c2cc978029E436B64b68Dd4";

        const signers = await ethers.getSigners();
        const eoa = signers[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));

        // found on etherscan
        const txHash = "0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb";
        const tx = await eoa.provider!.getTransaction(txHash);
        expect(tx).to.not.be.undefined;
        console.log(tx);
        
        /* construct txData
         * keccak256(rlp(nonce, gasprice, startgas, to, value, data, chainid, 0, 0))
        */
        let txData = {
            nonce: tx.nonce,
            gasPrice: tx.gasPrice,
            gasLimit: tx.gasLimit,
            to: tx.to,
            value: tx.value,
            data: tx.data,
            chainId: tx.chainId,
        }

        // recover rawPK from txData and r,s,v values
        let signData = ethers.utils.serializeTransaction(txData);
        let msgHash = ethers.utils.keccak256(signData); // the z value of ECDSA
        let signature = {r: tx.r!, s: tx.s!, v: tx.v!};
        let rawPK = ethers.utils.recoverPublicKey(msgHash, signature);

        // remove 04 since it shows it is a rawPK, but not a part of the key
        rawPK = "0x" + rawPK.slice(4);
        console.log(rawPK);

        // check if calculated the key corretly
        const givenAddress = "0x92b28647ae1f3264661f72fb2eb9625a89d88a31";
        const calculatedAddress = "0x" + ethers.utils.keccak256(rawPK).slice(-40); // get last 20 bytes of rawPK's keccak256 hash
        expect(calculatedAddress).to.be.eq(givenAddress);

        // call the authenticate function
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let target = contract.connect(eoa);

        let finalTx= await target.authenticate(rawPK);
        finalTx.wait();
    });
});
