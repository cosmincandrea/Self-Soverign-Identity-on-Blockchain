
///const ethers = require("@nomiclabs/hardhat-ethers");

async function main() {

    const DocumentMinter = await ethers.getContractFactory("DocumentMinter");
    const DocumentManager = await ethers.getContractFactory("DocumentManager");

    console.log("Deploying the contract...");
    const documentMinter = await DocumentMinter.deploy();
    await documentMinter.deployed();

    console.log("First contract deployed");

    const documentManager = await DocumentManager.deploy(documentMinter.address);
    await documentManager.deployed();

    console.log("Contracts deployed");

    console.log("Contract DocumentMinter deployed at address:", documentMinter.address);
    console.log("Contract DOcumentManager deployed at address:", documentManager.address);

    // Interact with the contract
    console.log("Setting value to 42...");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });