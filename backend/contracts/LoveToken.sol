// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error LoveToken__NotYourCollection();
error LoveToken__MaxLovers();
error LoveToken__SameAddresses(address first, address second);

contract LoveToken is ERC721, ERC721URIStorage {

    event CollectionCreated(uint256 indexed collectionId, uint256 indexed timestamp, string name, Profile profile, address owner);
    event NftMinted(uint256 indexed tokenId, uint256 indexed collectionId, uint256 indexed timestamp, string[] tags, string uri);
    event LoverLinked(address indexed linker, address indexed linked, uint256 indexed collectionId);
    event CollectionBurned(uint256 indexed collectionId);

    enum Profile { STRAIGHT, SAME_SEX, OTHERS }

    uint256 private _tokenId;
    uint256 private _collectionId;
    mapping(uint256 => uint256) tokenIdToCollectionId;
    mapping(uint256 => uint256[]) collectionIdToTokenIds;
    mapping(uint256 => address[]) collectionIdToLovers;
    mapping(uint256 => string) collectionIdToName;

    constructor() ERC721("LoveToken", "LVE") {}

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

    modifier differentAddresses(address first, address second) {
         if (first == second) {
            revert LoveToken__SameAddresses(first, second);
        }
        _;       
    }

    function mintNewCollection(string memory uri, string memory name, Profile profile, string[] calldata tags) public {
        _collectionId++;
        collectionIdToLovers[_collectionId].push(msg.sender);
        collectionIdToName[_collectionId] = name;
        emit CollectionCreated(_collectionId, block.timestamp, name, profile, msg.sender);
        _mint(uri, _collectionId, tags);
    }   

    function mintExistingCollection(string memory uri, uint256 collectionId, string[] calldata tags) public ownsCollection(msg.sender, collectionId) {
        _mint(uri, collectionId, tags);
    }

    function _mint(string memory uri, uint256 collectionId, string[] calldata tags) private {
        _tokenId++;
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, uri);
        tokenIdToCollectionId[_tokenId] = collectionId;
        emit NftMinted(_tokenId, collectionId, block.timestamp, tags, uri);
    }

    function linkLover(address lover, uint256 collectionId) public ownsCollection(msg.sender, collectionId) maxLovers(collectionId) differentAddresses(lover, msg.sender) {
        collectionIdToLovers[collectionId].push(lover);
        emit LoverLinked(msg.sender, lover, collectionId);
    }

    function burnCollection(uint256 collectionId) public {
        uint256[] memory tokenIds = collectionIdToTokenIds[collectionId];
        for (uint i = 0; i < tokenIds.length; i++) {
            _burn(tokenIds[i]);
        }
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