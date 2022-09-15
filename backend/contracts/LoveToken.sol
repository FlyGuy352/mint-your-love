// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error LoveToken__NotYourCollection();
error LoveToken__AlreadyLinkedPartner();
error LoveToken__SameAddresses(address first, address second);
error LoveToken__IllegalSender(bytes32 sender);

interface IOutbox {
    function dispatch(uint32 _destinationDomain, bytes32 _recipientAddress, bytes calldata _messageBody) external returns (uint256);
}

interface IMessageRecipient {
    function handle(uint32 _origin, bytes32 _sender, bytes calldata _messageBody) external;
}

contract LoveToken is ERC721, Ownable, IMessageRecipient {

    event CollectionCreated(uint256 indexed collectionId, uint256 indexed timestamp, string name, Profile profile, address owner);
    event NftMinted(uint256 indexed tokenId, uint256 indexed collectionId, uint256 indexed timestamp, string[] tags, string uri);
    event LoverLinked(address indexed linker, address indexed linked, uint256 indexed collectionId);
    event CollectionBurned(uint256 indexed collectionId);

    enum Profile { STRAIGHT, SAME_SEX, OTHERS }

    address public outbox;
    uint256 private _tokenIdCounter;
    uint256 private _collectionIdCounter;
    mapping(uint256 => Token) public tokenIdToDetails;
    mapping(uint256 => Collection) public collectionIdToDetails;
    mapping(uint32 => bytes32[]) public domainToWhitelistedAddresses;

    struct Collection {
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
        string uri;
    }

    modifier isOwnerOrPartner(address _minter, uint256 _collectionId) {
        Collection memory _collection = collectionIdToDetails[_collectionId];
        if(_minter != _collection.owner && _minter != _collection.partner) {
            revert LoveToken__NotYourCollection();
        }
        _;
    }

    modifier partnerNotYetLinked(uint256 _collectionId) {
        if (collectionIdToDetails[_collectionId].partner != address(0)) {
            revert LoveToken__AlreadyLinkedPartner();
        }
        _;
    }

    modifier differentAddresses(address _first, address _second) {
         if (_first == _second) {
            revert LoveToken__SameAddresses(_first, _second);
        }
        _;       
    }

    modifier onlyWhitelistedSender(uint32 _origin, bytes32 _sender) {
        bool whitelisted = false;
        
        bytes32[] memory whitelistedAddresses = domainToWhitelistedAddresses[_origin];

        for (uint i = 0; i < whitelistedAddresses.length; i++) {
            if(_sender == whitelistedAddresses[i]) {
                whitelisted = true;
            }
        }

        if (!whitelisted) {
            revert LoveToken__IllegalSender(_sender);
        }
        _;
    }

    constructor(address _outbox) ERC721("LoveToken", "LVE") {
        outbox = _outbox;
    }

    function mintNewCollection(string memory _uri, string memory _name, Profile _profile, string[] memory _tags) public {
        _mintNewCollection(_uri, _name, _profile, _tags, msg.sender);
    }   

    function mintExistingCollection(string memory _uri, uint256 _collectionId, string[] memory _tags) public isOwnerOrPartner(msg.sender, _collectionId) {
        _mint(_uri, _collectionId, _tags, msg.sender);
    }

    function linkLover(address _lover, uint256 _collectionId) public isOwnerOrPartner(msg.sender, _collectionId) partnerNotYetLinked(_collectionId) differentAddresses(_lover, msg.sender) {
        collectionIdToDetails[_collectionId].partner = _lover;
        emit LoverLinked(msg.sender, _lover, _collectionId);
    }

    function burnCollection(uint256 _collectionId) public isOwnerOrPartner(msg.sender, _collectionId) {
        Token[] memory _tokens = collectionIdToDetails[_collectionId].tokens;
        for (uint i = 0; i < _tokens.length; i++) {
            if(_isApprovedOrOwner(msg.sender, _tokens[i].id)) {
                _burn(_tokens[i].id);
            }
        }
        emit CollectionBurned(_collectionId);
    }

    function transferCollection(uint32 _destination, address _recipient, uint256 _collectionId) public isOwnerOrPartner(msg.sender, _collectionId) {
        burnCollection(_collectionId);
        IOutbox(outbox).dispatch(_destination, addressToBytes32(_recipient), abi.encode(msg.sender, collectionIdToDetails[_collectionId]));
    }

    function whitelistSender(uint32 _domain, address _sender) onlyOwner public {
        domainToWhitelistedAddresses[_domain].push(addressToBytes32(_sender));
    }

    function handle(uint32 _origin, bytes32 _sender, bytes calldata _messageBody) external override onlyWhitelistedSender(_origin, _sender)  {
        (address recipient, Collection memory _collection) = abi.decode(_messageBody, (address, Collection));
        for (uint i = 0; i < _collection.tokens.length; i++) {
            Token memory _token = _collection.tokens[i];
            if (i == 0) {
                _mintNewCollection(_token.uri, _collection.name, _collection.profile, _token.tags, recipient);
            } else {
                _mint(_token.uri, _collectionIdCounter, _token.tags, recipient);
            }
        }
    }

    function _mintNewCollection(string memory _uri, string memory _name, Profile _profile, string[] memory _tags, address _owner) private {
        Collection storage _collection = collectionIdToDetails[_collectionIdCounter++];
        _collection.timestamp = block.timestamp;
        _collection.name = _name;
        _collection.profile = _profile;
        _collection.owner = _owner;
        emit CollectionCreated(_collectionIdCounter, block.timestamp, _name, _profile, _owner);
        _mint(_uri, _collectionIdCounter, _tags, _owner);
    }   

    function _mint(string memory _uri, uint256 _collectionId, string[] memory _tags, address _owner) private {
        _safeMint(_owner, _tokenIdCounter++);
        Token memory _token = Token(_tokenIdCounter, block.timestamp, _tags, _uri);
        tokenIdToDetails[_tokenIdCounter] = _token;
        collectionIdToDetails[_collectionId].tokens.push(_token);
        emit NftMinted(_tokenIdCounter, _collectionId, block.timestamp, _tags, _uri);
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }
}