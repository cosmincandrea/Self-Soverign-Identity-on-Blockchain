// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DocumentMinter is ERC721URIStorage {
    uint256 private _tokenIdCounter;

    constructor() ERC721("DocumentNFT", "DNFT") {}

    struct TokenInfo {
        uint256 id;
        string uri;
    }
    struct TokenOwner {
        address owner;
        string uri;
    }

    struct ApprovalInfo {
        uint256 viewCount;
        uint256 lastViewTimestamp;
        address[] requesters;
        mapping(address => uint256) approvals;
    }

    mapping(address => uint256[]) private mapIds;
    //mapping(uint256 => )

    function mintNFT(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        mapIds[to].push(tokenId);
        _tokenIdCounter++;
    }

    function getOwnerAndUri(uint256 tokenId) external view returns (TokenOwner memory) {
        address owner = ownerOf(tokenId);
        string memory uri = tokenURI(tokenId);
        return TokenOwner(owner, uri);
    }

    function getOwnedTokenIds(address owner) external view returns (uint256[] memory) {
        return mapIds[owner];
    }

    function getOwnedTokenInfos(address owner) external view returns (TokenInfo[] memory) {
        uint256[] memory tokenIds = mapIds[owner];
        TokenInfo[] memory tokenInfos = new TokenInfo[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenInfos[i] = TokenInfo({
                id: tokenIds[i],
                uri: tokenURI(tokenIds[i])
            });
        }
        return tokenInfos;
    }
}
