// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error LoveToken__NotYourCollection();
error LoveToken__MaxLovers();

contract LoveToken is ERC721, ERC721URIStorage {

    event NftMinted(uint256 indexed collectionId, uint256 indexed tokenId);

    uint256 private _tokenId;
    uint256 private _collectionId;
    mapping(uint256 => address[]) collectionIdToLovers;

    constructor() ERC721("LoveToken", "LVE") {
        _collectionId = 1;
    }

    modifier ownsCollection(address minter, uint256 collectionId) {
        address[] memory lovers = collectionIdToLovers[collectionId];
        bool owns = false;
        for (uint i = 0; i < lovers.length; i++) {
            if (lovers[i] == minter) {
                owns = true;
            }
        }
        if (!owns) {
            revert LoveToken__NotYourCollection();
        }
        _;
    }

    modifier maxLovers(uint256 collectionId) {
        if (collectionIdToLovers[collectionId].length == 2) {
            revert LoveToken__MaxLovers();
        }
        _;
    }

    function mintNewCollection(string memory uri) public {
        _collectionId++;
        collectionIdToLovers[_collectionId].push(msg.sender);
        _mint(uri);
    }   

    function mintExistingCollection(string memory uri, uint256 collectionId) public ownsCollection(msg.sender, collectionId) {
        _mint(uri);
    }

    function _mint(string memory uri) private {
        _tokenId++;
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, uri);
        emit NftMinted(_collectionId, _tokenId);
    }

    function linkLover(address lover, uint256 collectionId) public ownsCollection(msg.sender, collectionId) maxLovers(collectionId) {
        collectionIdToLovers[collectionId].push(lover);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}