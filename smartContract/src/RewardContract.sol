// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * RewardContract - Issues LearnCredit tokens to students based on quiz performance
 * Deployed on Camp Network Testnet
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract RewardContract {
    address public owner;
    address public learnCreditToken;
    
    // Student address -> total rewards earned
    mapping(address => uint256) public studentRewards;
    
    // Student address -> quizzes completed
    mapping(address => uint256) public quizzesCompleted;
    
    // Events
    event RewardIssued(address indexed student, uint256 amount, string reason);
    event TokenAddressSet(address indexed tokenAddress);
    
    constructor(address _tokenAddress) {
        owner = msg.sender;
        learnCreditToken = _tokenAddress;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    /**
     * Award credits to a student for passing a quiz
     * 10 points = 1 token (mockup)
     */
    function awardCredits(address student, uint256 points) external onlyOwner {
        require(student != address(0), "Invalid student address");
        require(points > 0, "Points must be greater than 0");
        
        uint256 tokenAmount = (points * 1e18) / 10; // 10 points = 1 token
        
        studentRewards[student] += tokenAmount;
        quizzesCompleted[student] += 1;
        
        // In production, transfer actual tokens here
        // IERC20(learnCreditToken).transfer(student, tokenAmount);
        
        emit RewardIssued(student, tokenAmount, "Quiz completion reward");
    }
    
    /**
     * Award credits when student reaches a tier
     */
    function awardTierBonus(address student, string memory tier) external onlyOwner {
        require(student != address(0), "Invalid student address");
        
        uint256 bonus;
        if (keccak256(abi.encodePacked(tier)) == keccak256(abi.encodePacked("Silver"))) {
            bonus = 1000e18; // 1000 tokens for Silver
        } else if (keccak256(abi.encodePacked(tier)) == keccak256(abi.encodePacked("Gold"))) {
            bonus = 2000e18; // 2000 tokens for Gold
        }
        
        if (bonus > 0) {
            studentRewards[student] += bonus;
            emit RewardIssued(student, bonus, "Tier bonus");
        }
    }
    
    function getStudentRewards(address student) external view returns (uint256) {
        return studentRewards[student];
    }
    
    function getQuizzesCompleted(address student) external view returns (uint256) {
        return quizzesCompleted[student];
    }
}
