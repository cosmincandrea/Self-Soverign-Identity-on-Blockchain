// const { ethers } = require("hardhat");
// const documentManagerAbi = require("../../artifacts/contracts/DocumentManager.sol/DocumentManager.json").abi;
// const documentMinterAbi = require("../../artifacts/contracts/DocumentMinter.sol/DocumentMinter.json").abi;

// // Contract addresses
// const documentMinterAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";

// // Initialize ethers provider (using default provider for simplicity, you might want to use an Infura/Alchemy provider or a local node)
// async function getProviderAndSigner() {
//     const signers = await ethers.getSigners();
//     const signer = signers[0];
//     return signer;
// }

// // Mint NFT function
// async function mintNFT(owner, uri) {
//     try {
//         const signer = await getProviderAndSigner();
//         const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
//         console.log("OK pana aici");
//         const tx = await documentMinterContract.mintNFT(owner, uri);
//         await tx.wait();
//         console.log("Success:", tx);
//     } catch (error) {
//         console.error("Error minting NFT:", error);
//     }
// }

// // Get owned token information function
// async function getNFT() {
//     try {
//         const signer = await getProviderAndSigner();
//         const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
//         const nfts = await documentMinterContract.getOwnedTokenInfos("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
//         for (let i = 0; i < nfts.length; i++) {
//             console.log(`Token ID: ${nfts[i].id}, URI: ${nfts[i].uri}`);
//         }
//         console.log(`NFTs owned: `, nfts);
//     } catch (error) {
//         console.error("Error getting NFTs:", error);
//     }
// }

// // Ask for approval function
// async function askApproval(requester, tokenId) {
//     try {
//         const signer = await getProviderAndSigner();
//         const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
//         const tx = await documentMinterContract.askApproval(requester, tokenId);
//         await tx.wait();
//         console.log(`Approval requested for token ${tokenId} by ${requester}`);
//     } catch (error) {
//         console.error("Error requesting approval:", error);
//     }
// }

// // Approve request function
// async function approveRequest(requester, tokenId) {
//     try {
//         const signer = await getProviderAndSigner();
//         const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
//         const tx = await documentMinterContract.approveRequest(requester, tokenId);
//         await tx.wait();
//         console.log(`Approval granted for token ${tokenId} to ${requester}`);
//     } catch (error) {
//         console.error("Error approving request:", error);
//     }
// }

// // Consume approval function
// async function consumeApproval(requester, tokenId) {
//     try {
//         const signer = await getProviderAndSigner();
//         const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
//         const tx = await documentMinterContract.consumeApproval(requester, tokenId);
//         await tx.wait();
//         console.log(`Approval consumed for token ${tokenId} by ${requester}`);
//     } catch (error) {
//         console.error("Error consuming approval:", error);
//     }
// }

// // Get approval status function
// async function getApprovalStatus(requester, tokenId) {
//     try {
//         const signer = await getProviderAndSigner();
//         const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
//         const status = await documentMinterContract.getApprovalStatus(requester, tokenId);
//         console.log(`Approval status for token ${tokenId} and requester ${requester}: ${status}`);
//         return status;
//     } catch (error) {
//         console.error("Error getting approval status:", error);
//         return null;
//     }
// }

// // Get pending approvals function
// async function getPendingApprovals(tokenId) {
//     try {
//         const signer = await getProviderAndSigner();
//         const documentMinterContract = new ethers.Contract(documentMinterAddress, documentMinterAbi, signer);
//         const pendingRequesters = await documentMinterContract.getPendingApprovals(tokenId);
//         console.log(`Pending approvals for token ${tokenId}:`, pendingRequesters);
//         return pendingRequesters;
//     } catch (error) {
//         console.error("Error getting pending approvals:", error);
//         return [];
//     }
// }

// module.exports = {
//     mintNFT,
//     getNFT,
//     askApproval,
//     approveRequest,
//     consumeApproval,
//     getApprovalStatus,
//     getPendingApprovals
// };
