// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RewardContract
 * @notice Issues LearnCredit tokens to students based on quiz performance
 * @dev Integrates with WalletContract for seamless credit distribution
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IWalletContract {
    function addCredits(address student, uint256 amount) external;
    function hasWallet(address student) external view returns (bool);
}

contract RewardContract is Pausable, ReentrancyGuard, AccessControl {
    address public learnCreditToken;
    address public walletContract;
    
    // Student address -> total rewards earned
    mapping(address => uint256) public studentRewards;
    
    // Student address -> quizzes completed
    mapping(address => uint256) public quizzesCompleted;
    
    // Student address -> quiz ID -> completed
    mapping(address => mapping(uint256 => bool)) public quizCompletionStatus;
    
    // Tier thresholds
    uint256 public constant SILVER_THRESHOLD = 5000e18; // 5000 tokens
    uint256 public constant GOLD_THRESHOLD = 15000e18;  // 15000 tokens
    
    // Tier bonuses (one-time)
    mapping(address => bool) public silverBonusClaimed;
    mapping(address => bool) public goldBonusClaimed;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    // Events
    event RewardIssued(address indexed student, uint256 amount, string reason);
    event TokenAddressUpdated(address indexed oldToken, address indexed newToken);
    event WalletContractUpdated(address indexed oldWallet, address indexed newWallet);
    event TierBonusAwarded(address indexed student, string tier, uint256 amount);
    event QuizCompleted(address indexed student, uint256 indexed quizId, uint256 points);
    
    constructor(address _tokenAddress, address _walletContract) {
        // require(_tokenAddress != address(0), "Invalid token address");
        require(_walletContract != address(0), "Invalid wallet address");
        
        learnCreditToken = _tokenAddress;
        walletContract = _walletContract;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not admin");
        _;
    }
    
    modifier onlyVerifier() {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Caller is not verifier");
        _;
    }
    
    /**
     * @notice Award credits to a student for passing a quiz
     * @param student Address of the student
     * @param quizId Unique identifier for the quiz
     * @param points Points earned (10 points = 1 token)
     */
    function awardCredits(
        address student, 
        uint256 quizId, 
        uint256 points
    ) external onlyVerifier whenNotPaused nonReentrant {
        require(student != address(0), "Invalid student address");
        require(points > 0, "Points must be greater than 0");
        require(!quizCompletionStatus[student][quizId], "Quiz already completed");
        
        // Mark quiz as completed
        quizCompletionStatus[student][quizId] = true;
        
        uint256 tokenAmount = (points * 1e18) / 10; // 10 points = 1 token
        
        studentRewards[student] += tokenAmount;
        quizzesCompleted[student] += 1;
        
        // Transfer tokens to this contract first, then to wallet
        require(
            IERC20(learnCreditToken).transferFrom(msg.sender, address(this), tokenAmount),
            "Token transfer failed"
        );
        
        // Add credits to student's wallet
        if (IWalletContract(walletContract).hasWallet(student)) {
            IWalletContract(walletContract).addCredits(student, tokenAmount);
        }
        
        emit QuizCompleted(student, quizId, points);
        emit RewardIssued(student, tokenAmount, "Quiz completion reward");
        
        // Check and award tier bonuses
        _checkAndAwardTierBonus(student);
    }
    
    /**
     * @notice Batch award credits to multiple students
     * @param students Array of student addresses
     * @param quizIds Array of quiz IDs
     * @param pointsArray Array of points earned
     */
    function batchAwardCredits(
        address[] calldata students,
        uint256[] calldata quizIds,
        uint256[] calldata pointsArray
    ) external onlyVerifier whenNotPaused nonReentrant {
        require(
            students.length == quizIds.length && students.length == pointsArray.length,
            "Array length mismatch"
        );
        require(students.length <= 50, "Batch size too large");
        
        for (uint256 i = 0; i < students.length; i++) {
            if (!quizCompletionStatus[students[i]][quizIds[i]] && pointsArray[i] > 0) {
                _awardCreditsInternal(students[i], quizIds[i], pointsArray[i]);
            }
        }
    }
    
    /**
     * @notice Internal function to award credits
     */
    function _awardCreditsInternal(
        address student,
        uint256 quizId,
        uint256 points
    ) internal {
        quizCompletionStatus[student][quizId] = true;
        
        uint256 tokenAmount = (points * 1e18) / 10;
        studentRewards[student] += tokenAmount;
        quizzesCompleted[student] += 1;
        
        require(
            IERC20(learnCreditToken).transferFrom(msg.sender, address(this), tokenAmount),
            "Token transfer failed"
        );
        
        if (IWalletContract(walletContract).hasWallet(student)) {
            IWalletContract(walletContract).addCredits(student, tokenAmount);
        }
        
        emit QuizCompleted(student, quizId, points);
        emit RewardIssued(student, tokenAmount, "Quiz completion reward");
        
        _checkAndAwardTierBonus(student);
    }
    
    /**
     * @notice Check and award tier bonus if threshold reached
     */
    function _checkAndAwardTierBonus(address student) internal {
        uint256 totalRewards = studentRewards[student];
        
        // Check Gold tier (must check first as it's higher)
        if (totalRewards >= GOLD_THRESHOLD && !goldBonusClaimed[student]) {
            goldBonusClaimed[student] = true;
            uint256 bonus = 2000e18; // 2000 tokens
            
            studentRewards[student] += bonus;
            
            if (IWalletContract(walletContract).hasWallet(student)) {
                IWalletContract(walletContract).addCredits(student, bonus);
            }
            
            emit TierBonusAwarded(student, "Gold", bonus);
            emit RewardIssued(student, bonus, "Gold tier bonus");
        }
        // Check Silver tier
        else if (totalRewards >= SILVER_THRESHOLD && !silverBonusClaimed[student]) {
            silverBonusClaimed[student] = true;
            uint256 bonus = 1000e18; // 1000 tokens
            
            studentRewards[student] += bonus;
            
            if (IWalletContract(walletContract).hasWallet(student)) {
                IWalletContract(walletContract).addCredits(student, bonus);
            }
            
            emit TierBonusAwarded(student, "Silver", bonus);
            emit RewardIssued(student, bonus, "Silver tier bonus");
        }
    }
    
    /**
     * @notice Manually award tier bonus (admin only)
     * @param student Address of the student
     * @param tier Tier name ("Silver" or "Gold")
     */
    function manualAwardTierBonus(address student, string memory tier) external onlyAdmin {
        require(student != address(0), "Invalid student address");
        
        uint256 bonus;
        if (keccak256(abi.encodePacked(tier)) == keccak256(abi.encodePacked("Silver"))) {
            require(!silverBonusClaimed[student], "Silver bonus already claimed");
            silverBonusClaimed[student] = true;
            bonus = 1000e18;
        } else if (keccak256(abi.encodePacked(tier)) == keccak256(abi.encodePacked("Gold"))) {
            require(!goldBonusClaimed[student], "Gold bonus already claimed");
            goldBonusClaimed[student] = true;
            bonus = 2000e18;
        } else {
            revert("Invalid tier");
        }
        
        studentRewards[student] += bonus;
        
        if (IWalletContract(walletContract).hasWallet(student)) {
            IWalletContract(walletContract).addCredits(student, bonus);
        }
        
        emit TierBonusAwarded(student, tier, bonus);
        emit RewardIssued(student, bonus, "Manual tier bonus");
    }
    
    /**
     * @notice Update token address
     * @param newToken New token contract address
     */
    function updateTokenAddress(address newToken) external onlyAdmin {
        require(newToken != address(0), "Invalid address");
        address oldToken = learnCreditToken;
        learnCreditToken = newToken;
        emit TokenAddressUpdated(oldToken, newToken);
    }
    
    /**
     * @notice Update wallet contract address
     * @param newWallet New wallet contract address
     */
    function updateWalletContract(address newWallet) external onlyAdmin {
        require(newWallet != address(0), "Invalid address");
        address oldWallet = walletContract;
        walletContract = newWallet;
        emit WalletContractUpdated(oldWallet, newWallet);
    }
    
    /**
     * @notice Get student tier
     * @param student Address of the student
     */
    function getStudentTier(address student) external view returns (string memory) {
        uint256 rewards = studentRewards[student];
        if (rewards >= GOLD_THRESHOLD) {
            return "Gold";
        } else if (rewards >= SILVER_THRESHOLD) {
            return "Silver";
        } else {
            return "Bronze";
        }
    }
    
    /**
     * @notice Get student rewards
     */
    function getStudentRewards(address student) external view returns (uint256) {
        return studentRewards[student];
    }
    
    /**
     * @notice Get quizzes completed
     */
    function getQuizzesCompleted(address student) external view returns (uint256) {
        return quizzesCompleted[student];
    }
    
    /**
     * @notice Check if quiz is completed
     */
    function isQuizCompleted(address student, uint256 quizId) external view returns (bool) {
        return quizCompletionStatus[student][quizId];
    }
    
    /**
     * @notice Get comprehensive student stats
     */
    function getStudentStats(address student) external view returns (
        uint256 totalRewards,
        uint256 totalQuizzes,
        string memory tier,
        bool silverClaimed,
        bool goldClaimed
    ) {
        totalRewards = studentRewards[student];
        totalQuizzes = quizzesCompleted[student];
        
        if (totalRewards >= GOLD_THRESHOLD) {
            tier = "Gold";
        } else if (totalRewards >= SILVER_THRESHOLD) {
            tier = "Silver";
        } else {
            tier = "Bronze";
        }
        
        silverClaimed = silverBonusClaimed[student];
        goldClaimed = goldBonusClaimed[student];
    }
    
    // Emergency functions
    function pause() external onlyAdmin {
        _pause();
    }
    
    function unpause() external onlyAdmin {
        _unpause();
    }
    
    /**
     * @notice Emergency token withdrawal
     */
    function emergencyTokenWithdraw(address token, uint256 amount) external onlyAdmin {
        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");
    }
}