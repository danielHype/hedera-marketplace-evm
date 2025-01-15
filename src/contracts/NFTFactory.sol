// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// The NFT contract that will be deployed
contract SimpleNFT is ERC721, Ownable {
    string private baseURI;
    uint256 private _nextTokenId;

    constructor(
        string memory name,
        string memory symbol,
        string memory _baseURI,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        baseURI = _baseURI;
    }

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}

// The factory contract that deploys NFT contracts
contract NFTFactory {
    event NFTContractDeployed(address indexed nftContract, string name, string symbol, address indexed owner);

    function deployNFT(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) external returns (address) {
        SimpleNFT nft = new SimpleNFT(
            name,
            symbol,
            baseURI,
            msg.sender
        );
        
        emit NFTContractDeployed(address(nft), name, symbol, msg.sender);
        return address(nft);
    }
} 