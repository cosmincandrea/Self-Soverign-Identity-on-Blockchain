const { ethers } = require("hardhat");
const documentManagerAbi = require("../../artifacts/contracts/DocumentManager.sol/DocumentManager.json").abi
const documentMinterAbi = require("../../artifacts/contracts/DocumentMinter.sol/DocumentMinter.json").abi;
const ipfsRetriver = require('../ipfs/ipfsRetriver');
const userService = require('./UserService');

// Contract addresses
const documentManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const documentMinterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function getProviderAndSigner() {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  return signer;
}


// Mint NFT function
async function mintNFT(owner, uri) {
  try {
    const signer = await getProviderAndSigner();
    const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
    console.log("OK pana aici");
    const tx = await documentMinterContract.mintNFT(owner, uri);
    await tx.wait();
    console.log("Success:", tx);
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}


async function getOwnerAndURI(tokenId) {
  try {
    const signer = await getProviderAndSigner();
    const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
    const tx = await documentMinterContract.getOwnerAndUri(tokenId);
    console.log("Success:", tx);
    return tx;
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

// Get owned token information function
async function getNFT(owner) {
  try {
    const signer = await getProviderAndSigner();
    const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
    const nfts = await documentMinterContract.getOwnedTokenInfos(owner);

    const documentManager = new ethers.Contract(documentManagerAddress, documentManagerAbi, signer);
    var attributesList = [];
    for (let i = 0; i < nfts.length; i++) {
      console.log(`Token ID: ${nfts[i].id}, URI: ${nfts[i].uri}`);
      var data = await ipfsRetriver.retrieveFromIPFS(nfts[i].uri);
      var response = await documentManager.getViewInfo(parseInt(nfts[i].id.toString()));
      
      if (data){
        console.log(response);
        data.viewCount = parseInt(response.viewCount.toString());
        var trueDate = new Date(parseInt(response.lastViewTimestamp.toString()) * 1000)
        data.timestamp = trueDate;
        data.tokenId = parseInt(nfts[i].id.toString());
        attributesList.push(data);
      }
    }
    console.log(`NFTs owned: `, attributesList);
    return attributesList;
  } catch (error) {
    console.error("Error getting NFTs:", error);
  }
  return null;
}

async function getSafeNFT(owner) {
  try {
    const signer = await getProviderAndSigner();
    const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
    const nfts = await documentMinterContract.getOwnedTokenInfos(owner);
    var attributesList = [];
    for (let i = 0; i < nfts.length; i++) {
      console.log(`Token ID: ${nfts[i].id}, URI: ${nfts[i].uri}`);
      var data = await ipfsRetriver.retrieveFromIPFS(nfts[i].uri);
      if (data)
        attributesList.push({id: parseInt(nfts[i].id.toString()), name: data.attributes.name});
    }
    console.log(`NFTs owned: `, attributesList);
    return attributesList;
  } catch (error) {
    console.error("Error getting NFTs:", error);
  }
  return null;
}

// Ask for approval function
async function askApproval(requester, tokenId, type) {
  try {
    const signer = await getProviderAndSigner();
    const documentManager = new ethers.Contract(documentManagerAddress, documentManagerAbi, signer);
    const tx = await documentManager.askApproval(requester, tokenId, type);
    await tx.wait();
    console.log(`Approval requested for token ${tokenId} by ${requester}`);
  } catch (error) {
    console.error("Error requesting approval:", error);
  }
}

async function getAskedApprovals(requester) {
  try {
    const signer = await getProviderAndSigner();
    const documentManager = new ethers.Contract(documentManagerAddress, documentManagerAbi, signer);
    const tx = await documentManager.getTokenIdsForRequester(requester);
    var retVal = [];
    for (var i = 0; i< tx.length; i++){
      var tokenId = parseInt(tx[i].toString());
      var status = await getApprovalStatus(requester, tokenId);
      var extraData = await getOwnerAndURI(tokenId);
      var username = await userService.getUsernameForAccount(extraData[0]);
      console.log(username);
      var data = await ipfsRetriver.retrieveFromIPFS(extraData[1]);
      var documentName = data.attributes.name;
      retVal.push({tokenId: tokenId, status: parseInt(status.toString()), username: username, docName: documentName, hash: extraData[1]});
    }
    console.log(retVal);
    return retVal;
  } catch (error) {
    console.error("Error requesting approval:", error);
  }
}



// Approve request function
async function approveRequest(requester, tokenId) {
  try {
    var account = await userService.getAccountForUsername(requester);
    const signer = await getProviderAndSigner();
    const documentManager = new ethers.Contract(documentManagerAddress, documentManagerAbi, signer);
    const tx = await documentManager.approveRequest(account, tokenId);
    await tx.wait();
    console.log(`Approval granted for token ${tokenId} to ${requester}`);
  } catch (error) {
    console.error("Error approving request:", error);
  }
}

// Consume approval function
async function consumeApproval(requester, tokenId) {
  try {
    const signer = await getProviderAndSigner();
    const documentManager = new ethers.Contract(documentManagerAddress, documentManagerAbi, signer);
    const tx = await documentManager.consumeApproval(requester, tokenId);
    await tx.wait();
    console.log(`Approval consumed for token ${tokenId} by ${requester}`);
  } catch (error) {
    console.error("Error consuming approval:", error);
  }
}

// Get approval status function
async function getApprovalStatus(requester, tokenId) {
  try {
    const signer = await getProviderAndSigner();
    const documentManager = new ethers.Contract(documentManagerAddress, documentManagerAbi, signer);
    const status = await documentManager.getApprovalStatus(requester, tokenId);
    console.log(`Approval status for token ${tokenId} and requester ${requester}: ${status}`);
    return status;
  } catch (error) {
    console.error("Error getting approval status:", error);
    return null;
  }
}

// Get pending approvals function
async function getPendingApprovals(tokenId) {
  try {
    const signer = await getProviderAndSigner();
    const documentManager = new ethers.Contract(documentManagerAddress, documentManagerAbi, signer);
    const pendingRequesters = await documentManager.getPendingApprovals(tokenId);
    //console.log(pendingRequesters)
    var returnData = [];
    for(var i = 0; i < pendingRequesters.length; i++){
        var name = await userService.getUsernameForAccount(pendingRequesters[i][0]);
        returnData.push({name: name, approvalType: parseInt(pendingRequesters[i][1].toString()) });
      }
    console.log(`Pending approvals for token ${tokenId}:`, returnData);
    return returnData;
  } catch (error) {
    console.error("Error getting pending approvals:", error);
    return [];
  }
}

module.exports = {
  mintNFT,
  getNFT,
  askApproval,
  approveRequest,
  consumeApproval,
  getApprovalStatus,
  getPendingApprovals,
  getSafeNFT,
  getAskedApprovals
};
