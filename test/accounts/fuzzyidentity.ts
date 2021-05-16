import { ethers } from "hardhat";
import { expect } from "chai";


type SaltAddrPair = {
    saltVal: string,
    addr: string,
}

function bruteforceSalt(address: string, bytecode: string): SaltAddrPair|undefined {
    let bytecodeHash = ethers.utils.keccak256(bytecode);

    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
        let salt = "0x" + i.toString(16).padStart(64, '0');
        let deployAddress = ethers.utils.getCreate2Address(address, salt ,bytecodeHash);

        if (deployAddress.toLowerCase().includes('badc0de')) {
            console.log("Salt found!!!!");
            console.log(deployAddress);
            console.log(i + ":" + salt);
            return {saltVal: salt, addr: deployAddress};
        }

        if (i % 1000 == 0) {
            console.log("Counter\t" + i);
        }
    }

}

describe("fuzzyidentity", function() {
    it("Should solve the fuzzyidentity challenge.", async function() {
        this.timeout(0);

        const PROXY_CONT_BYTECODE = "0x608060405234801561001057600080fd5b50610164806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806306fdde031461003b578063d018db3e14610059575b600080fd5b61004361009d565b6040518082815260200191505060405180910390f35b61009b6004803603602081101561006f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506100c5565b005b60007f736d617278000000000000000000000000000000000000000000000000000000905090565b60008190508073ffffffffffffffffffffffffffffffffffffffff1663380c7a676040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561011257600080fd5b505af1158015610126573d6000803e3d6000fd5b50505050505056fea26469706673582212201a6250da8bc7425882b9fb2f38181d8bb4f939f29b0f843f736c47d69c9ab92464736f6c63430007040033";

        const signers = await ethers.getSigners();
        const eoa = signers[0];
        let balance = await eoa.getBalance();
        console.log(ethers.utils.formatEther(balance));

        
        
        /*
        // deploy the deployer
        let factory = await ethers.getContractFactory("FuzzyIdDeployer");
        let deployerCont = await factory.deploy();

        // wait for transaction to complete
        await eoa.provider?.waitForTransaction(deployerCont.deployTransaction.hash);
        console.log(deployerCont.address);
        */

        // local test
        /*
        let challengeFactory = await ethers.getContractFactory("FuzzyIdentityChallenge");
        let challengeCont = await challengeFactory.deploy();
        */


        // let pair = bruteforceSalt(deployerCont.address, PROXY_CONT_BYTECODE);
        //const salt = "0x000000000000000000000000000000000000000000000000000000000040a07d";
        /* result:
        * 0x05d4C69CBADC0dEe033cef0a5b70eA7822978478 
        */
        
        /*
        const salt = "0x0000000000000000000000000000000000000000000000000000000000833561"; 
        let deployerCont = factory.attach("0xb0D0c6A34713707f2F567A2f9AC07E2a90971262");
        */
        
        /*
        let tx = await deployerCont.deploy(pair!.saltVal);
        await tx.wait();
        console.log(tx);
        */ 

        
        
        /*
        let proxyFactory = await ethers.getContractFactory("FuzzyIdentityProxy");


        let proxyCont = proxyFactory.attach("0x05d4C69CBADC0dEe033cef0a5b70eA7822978478");
        let tx = await proxyCont.attack("0x37Ff9c942c420E44f0323E615332630Ee0773953");
        await tx.wait();
        console.log(tx);
        expect(tx.hash).to.not.be.null;
        */

        let challengeFactory = await ethers.getContractFactory("FuzzyIdentityChallenge");
        let challengeCont = challengeFactory.attach("0x37Ff9c942c420E44f0323E615332630Ee0773953");
        let isok = await challengeCont.isComplete();
        console.log(isok);
    });
});
