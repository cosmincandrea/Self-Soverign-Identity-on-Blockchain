const express = require("express");
const bodyParser = require("body-parser");
const {
  mintNFT,
  getNFT,
  askApproval,
  approveRequest,
  consumeApproval,
  getApprovalStatus,
  getPendingApprovals,
  getSafeNFT,
  getAskedApprovals
} = require("../services/ethService");

var router = express.Router();
var ethRouter = express.Router();

// Mint NFT endpoint
ethRouter.post("/mint", async (req, res) => {
  const { owner, uri } = req.body;
  try {
    await mintNFT(owner, uri);
    res.status(200).send("NFT minted successfully");
  } catch (error) {
    res.status(500).send(`Error minting NFT: ${error.message}`);
  }
});

// Get NFTs owned by an address
ethRouter.post("/nfts", async (req, res) => {
  const { owner } = req.body;
  try {
    const nfts = await getNFT(owner);
    res.status(200).json(nfts);
  } catch (error) {
    res.status(500).send(`Error getting NFTs: ${error.message}`);
  }
});


ethRouter.post("/safe/nfts", async (req, res) => {
    const { owner } = req.body;
    try {
      const nfts = await getSafeNFT(owner);
      res.status(200).json(nfts);
    } catch (error) {
      res.status(500).send(`Error getting NFTs: ${error.message}`);
    }
  });

// Request approval for a token
ethRouter.post("/request-approval", async (req, res) => {
  const { requester, tokenId, type } = req.body;
  try {
    await askApproval(requester, tokenId, type);
    res.status(200).send(`Approval requested for token ${tokenId} by ${requester}`);
  } catch (error) {
    res.status(500).send(`Error requesting approval: ${error.message}`);
  }
});

// Approve a request for a token
ethRouter.post("/approve", async (req, res) => {
  const { requester, tokenId } = req.body;
  try {
    await approveRequest(requester, tokenId);
    res.status(200).send(`Approval granted for token ${tokenId} to ${requester}`);
  } catch (error) {
    res.status(500).send(`Error approving request: ${error.message}`);
  }
});

ethRouter.post("/getAskedApprovals", async (req, res) => {
  const { requester } = req.body;
  try {
    var ret = await getAskedApprovals(requester);
    res.status(200).send(ret);
  } catch (error) {
    res.status(500).send(`Error approving request: ${error.message}`);
  }
});

// Consume approval for a token
ethRouter.post("/consume-approval", async (req, res) => {
  const { requester, tokenId } = req.body;
  try {
    await consumeApproval(requester, tokenId);
    res.status(200).send(`Approval consumed for token ${tokenId} by ${requester}`);
  } catch (error) {
    res.status(500).send(`Error consuming approval: ${error.message}`);
  }
});

// Get approval status for a token and requester
ethRouter.post("/approval-status", async (req, res) => {
  const { requester, tokenId } = req.body;
  try {
    const status = await getApprovalStatus(requester, tokenId);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).send(`Error getting approval status: ${error.message}`);
  }
});

// Get pending approvals for a token
ethRouter.post("/pending-approvals", async (req, res) => {
  const { tokenId } = req.body;
  try {
    const pendingRequesters = await getPendingApprovals(tokenId);
    res.status(200).json(pendingRequesters);
  } catch (error) {
    res.status(500).send(`Error getting pending approvals: ${error.message}`);
  }
});

router.use('/eth', ethRouter);

module.exports = router;