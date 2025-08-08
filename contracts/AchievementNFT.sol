// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AchievementNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct Achievement {
        string title;
        string achievementType;
        string role;
        string technologies;
        uint256 timestamp;
        address minter;
    }
    
    mapping(uint256 => Achievement) public achievements;
    mapping(address => uint256[]) public userAchievements;
    
    event AchievementMinted(
        uint256 indexed tokenId,
        address indexed minter,
        string title,
        string achievementType
    );
    
    constructor() ERC721("AchievementNFT", "ACHIEVE") {}
    
    function mintAchievement(
        address to,
        string memory tokenURI,
        string memory title,
        string memory achievementType,
        string memory role,
        string memory technologies
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        achievements[tokenId] = Achievement({
            title: title,
            achievementType: achievementType,
            role: role,
            technologies: technologies,
            timestamp: block.timestamp,
            minter: to
        });
        
        userAchievements[to].push(tokenId);
        
        emit AchievementMinted(tokenId, to, title, achievementType);
        
        return tokenId;
    }
    
    function getUserAchievements(address user) public view returns (uint256[] memory) {
        return userAchievements[user];
    }
    
    function getAchievement(uint256 tokenId) public view returns (Achievement memory) {
        require(_exists(tokenId), "Achievement does not exist");
        return achievements[tokenId];
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
