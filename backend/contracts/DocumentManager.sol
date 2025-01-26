pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./DocumentMinter.sol";


contract DocumentManager{
    
   DocumentMinter private documentMinter;

    struct ApprovalInfo {
        uint256 viewCount;
        uint256 lastViewTimestamp;
        address[] requesters;
        mapping(address => uint256) approvals;
    }

    struct ViewInfo{
        uint256 viewCount;
        uint256 lastViewTimestamp;
    }

    mapping(uint256 => ApprovalInfo) private approvalInfos;
    mapping(address => uint256[]) private approvalIds;

    constructor(address documentMinterAddress) {
        documentMinter = DocumentMinter(documentMinterAddress);
    }


    function getViewInfo(uint256 tokenId)public view returns (ViewInfo memory) {
        return ViewInfo(approvalInfos[tokenId].viewCount, approvalInfos[tokenId].lastViewTimestamp);
    }

    function initTokenId(uint256 tokenId) public {
        approvalInfos[tokenId].viewCount = 0;
        approvalInfos[tokenId].lastViewTimestamp = 0;
    }

    function askApproval(address requester, uint256 tokenId, uint256 ty) public {
    approvalIds[requester].push(tokenId);
    bool alreadyRequested = false;
    for (uint256 i = 0; i < approvalInfos[tokenId].requesters.length; i++) {
        if (approvalInfos[tokenId].requesters[i] == requester) {
            alreadyRequested = true;
            break;
        }
    }
    if (!alreadyRequested) {
        approvalInfos[tokenId].requesters.push(requester);
    }
    approvalInfos[tokenId].approvals[requester] = ty;
    }

    function approveRequest(address requester, uint256 tokenId) public {
        if (approvalInfos[tokenId].approvals[requester] == 1)
            approvalInfos[tokenId].approvals[requester] = 3;
        else
            approvalInfos[tokenId].approvals[requester] = 4;
    }

    function consumeApproval(address requester, uint256 tokenId) public {
        approvalInfos[tokenId].approvals[requester] = 0;
        approvalInfos[tokenId].viewCount++;
        approvalInfos[tokenId].lastViewTimestamp = block.timestamp;
        uint256 length = approvalIds[requester].length;
        for (uint256 i = 0; i < length; i++) {
            if (approvalIds[requester][i] == tokenId) {
                approvalIds[requester][i] = approvalIds[requester][length - 1];
                approvalIds[requester].pop();
                break;
            }
        }
    }

    function getApprovalStatus(address requester, uint256 tokenId) public view returns (uint256) {
        return approvalInfos[tokenId].approvals[requester];
    }

    function getTokenIdsForRequester(address requester) external view returns (uint256[] memory) {
        return approvalIds[requester];
    }

    struct ApprovalData {
        address owner;
        uint256 ty;
    }

    function getPendingApprovals(uint256 tokenId) external view returns (ApprovalData[] memory) {
        ApprovalInfo storage approvalInfo = approvalInfos[tokenId];
        uint256 pendingCount = 0;

        
        for (uint256 i = 0; i < approvalInfo.requesters.length; i++) {
            if (approvalInfo.approvals[approvalInfo.requesters[i]] == 1 || approvalInfo.approvals[approvalInfo.requesters[i]] == 2) {
                pendingCount++;
            }
        }
        
        ApprovalData[] memory approvalData = new ApprovalData[](pendingCount);
        uint256 index = 0;
        for (uint256 i = 0; i < approvalInfo.requesters.length; i++) {
            if (approvalInfo.approvals[approvalInfo.requesters[i]] == 1 || approvalInfo.approvals[approvalInfo.requesters[i]] == 2) {
                approvalData[index] = ApprovalData(approvalInfo.requesters[i], approvalInfo.approvals[approvalInfo.requesters[i]]);
                index++;
            }
        }

        return approvalData;
    }

    


    
}
