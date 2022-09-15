// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import { Router } from "@abacus-network/app/contracts/Router.sol";

error LoveToken__NotYourCollection();
error LoveToken__AlreadyLinkedPartner();
error LoveToken__SameAddresses(address first, address second);

contract LoveToken is ERC721, ERC721URIStorage {

    event CollectionCreated(uint256 indexed collectionId, uint256 indexed timestamp, string name, Profile profile, address owner);
    event NftMinted(uint256 indexed tokenId, uint256 indexed collectionId, uint256 indexed timestamp, string[] tags, string uri);
    event LoverLinked(address indexed linker, address indexed linked, uint256 indexed collectionId);
    event CollectionBurned(uint256 indexed collectionId);

    enum Profile { STRAIGHT, SAME_SEX, OTHERS }

    uint256 private _tokenId;
    uint256 private _collectionId;
    mapping(uint256 => Token) public tokenIdToDetails;
    mapping(uint256 => Collection) public collectionIdToDetails;

    struct Collection {
        uint256 id;
        uint256 timestamp;
        string name;
        Token[] tokens;
        Profile profile;
        address owner;
        address partner;
    }

    struct Token {
        uint256 id;
        uint256 timestamp;
        string[] tags;
    }

    constructor() ERC721("LoveToken", "LVE") {}

    modifier isOwnerOrPartner(address minter, uint256 collectionId) {
        Collection memory _collection = collectionIdToDetails[collectionId];
        if(minter != _collection.owner && minter != _collection.partner) {
            revert LoveToken__NotYourCollection();
        }
        _;
    }

    modifier partnerNotYetLinked(uint256 collectionId) {
        if (collectionIdToDetails[collectionId].partner != address(0)) {
            revert LoveToken__AlreadyLinkedPartner();
        }
        _;
    }

    modifier differentAddresses(address first, address second) {
         if (first == second) {
            revert LoveToken__SameAddresses(first, second);
        }
        _;       
    }

    /*function initialize(address xAppConnectionManager) external initializer {
        __Router_initialize(xAppConnectionManager);
    }*/

    function mintNewCollection(string memory uri, string memory name, Profile profile, string[] calldata tags) public {
        _collectionId++;
        collectionIdToDetails[_collectionId] = Collection(_collectionId, block.timestamp, name, null, profile, msg.sender, address(0));
        emit CollectionCreated(_collectionId, block.timestamp, name, profile, msg.sender);
        _mint(uri, _collectionId, tags);
    }   

    function mintExistingCollection(string memory uri, uint256 collectionId, string[] calldata tags) public isOwnerOrPartner(msg.sender, collectionId) {
        _mint(uri, collectionId, tags);
    }

    function _mint(string memory uri, uint256 collectionId, string[] memory tags) private {
        _tokenId++;
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, uri);
        Token memory _token = Token(_tokenId, block.timestamp, tags);
        tokenIdToDetails[_tokenId] = _token;
        collectionIdToDetails[_collectionId].tokens.push(_token);
        emit NftMinted(_tokenId, collectionId, block.timestamp, tags, uri);
    }

    function linkLover(address lover, uint256 collectionId) public isOwnerOrPartner(msg.sender, collectionId) partnerNotYetLinked(collectionId) differentAddresses(lover, msg.sender) {
        collectionIdToDetails[collectionId].partner = lover;
        emit LoverLinked(msg.sender, lover, collectionId);
    }

    function burnCollection(uint256 collectionId) public isOwnerOrPartner(msg.sender, collectionId) {
        Token[] memory _tokens = collectionIdToDetails[_collectionId].tokens;
        for (uint i = 0; i < _tokens.length; i++) {
            if(_isApprovedOrOwner(msg.sender, _tokens[i].id)) {
                _burn(_tokens[i].id);
            }
        }
        emit CollectionBurned(collectionId);
    }

    function transferCollection(uint256 destination, address recipient, uint256 collectionId) public isOwnerOrPartner(msg.sender, collectionId) payable {
        burnCollection(collectionId);
    }

   // function _handle(uint32 /*origin*/, bytes32 /*sender*/, bytes memory message) internal override {
       // (address recipient, uint256 collectionId, uint256[] memory tokenIds) = abi.decode(message, (address, uint256, uint256[]));

//    }

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