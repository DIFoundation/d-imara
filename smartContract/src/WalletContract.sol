// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title WalletContract
 * @notice Education wallet with purpose-locked spending
 * @dev Students can spend tokens on approved categories: books, fees, supplies
 */
contract WalletContract is Pausable, ReentrancyGuard, AccessControl {
    
    enum SpendingCategory { BOOKS, FEES, SUPPLIES }
    
    struct Wallet {
        uint256 balance;
        uint256 totalSpent;
        mapping(SpendingCategory => bool) allowedCategories;
    }
    
    struct SpendingRequest {
        address student;
        uint256 amount;
        SpendingCategory category;
        string merchantAddress;
        bool approved;
        bool executed;
    }
    
    mapping(address => Wallet) public wallets;
    mapping(address => bool) public hasWallet;
    mapping(uint256 => SpendingRequest) public spendingRequests;
    uint256 public nextRequestId;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");
    
    event WalletCreated(address indexed student);
    event CreditsAdded(address indexed student, uint256 amount);
    event SpendingRequested(uint256 indexed requestId, address indexed student, uint256 amount, SpendingCategory category);
    event SpendingApproved(uint256 indexed requestId, address indexed student, uint256 amount);
    event CreditsSpent(address indexed student, uint256 amount, SpendingCategory category);
    event CategoryUpdated(address indexed student, SpendingCategory category, bool allowed);
    event EmergencyWithdraw(address indexed student, uint256 amount);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not admin");
        _;
    }
    
    modifier onlyStudent(address student) {
        require(msg.sender == student, "Not authorized");
        _;
    }
    
    /**
     * @notice Create education wallet for a student
     * @param student Address of the student
     */
    function createWallet(address student) external onlyAdmin whenNotPaused {
        require(student != address(0), "Invalid address");
        require(!hasWallet[student], "Wallet already exists");
        
        Wallet storage wallet = wallets[student];
        wallet.balance = 0;
        wallet.totalSpent = 0;
        
        // Set default allowed categories
        wallet.allowedCategories[SpendingCategory.BOOKS] = true;
        wallet.allowedCategories[SpendingCategory.FEES] = true;
        wallet.allowedCategories[SpendingCategory.SUPPLIES] = true;
        
        hasWallet[student] = true;
        emit WalletCreated(student);
    }
    
    /**
     * @notice Add credits to wallet (from reward system or direct deposit)
     * @param student Address of the student
     * @param amount Amount of credits to add
     */
    function addCredits(address student, uint256 amount) external onlyAdmin whenNotPaused {
        require(hasWallet[student], "Wallet does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        wallets[student].balance += amount;
        emit CreditsAdded(student, amount);
    }
    
    /**
     * @notice Student requests to spend credits
     * @param amount Amount to spend
     * @param categoryIndex Category index (0=BOOKS, 1=FEES, 2=SUPPLIES)
     * @param merchantAddress Identifier for merchant/vendor
     */
    function requestSpending(
        uint256 amount, 
        uint8 categoryIndex, 
        string memory merchantAddress
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(hasWallet[msg.sender], "Wallet does not exist");
        require(amount > 0, "Amount must be greater than 0");
        require(wallets[msg.sender].balance >= amount, "Insufficient balance");
        require(categoryIndex < 3, "Invalid category");
        
        SpendingCategory category = SpendingCategory(categoryIndex);
        require(wallets[msg.sender].allowedCategories[category], "Category not allowed");
        
        uint256 requestId = nextRequestId++;
        spendingRequests[requestId] = SpendingRequest({
            student: msg.sender,
            amount: amount,
            category: category,
            merchantAddress: merchantAddress,
            approved: false,
            executed: false
        });
        
        emit SpendingRequested(requestId, msg.sender, amount, category);
        return requestId;
    }
    
    /**
     * @notice Admin approves and executes spending request
     * @param requestId ID of the spending request
     */
    function approveSpending(uint256 requestId) external onlyAdmin whenNotPaused nonReentrant {
        SpendingRequest storage request = spendingRequests[requestId];
        require(!request.executed, "Already executed");
        require(!request.approved, "Already approved");
        require(hasWallet[request.student], "Wallet does not exist");
        require(wallets[request.student].balance >= request.amount, "Insufficient balance");
        
        request.approved = true;
        request.executed = true;
        
        wallets[request.student].balance -= request.amount;
        wallets[request.student].totalSpent += request.amount;
        
        emit SpendingApproved(requestId, request.student, request.amount);
        emit CreditsSpent(request.student, request.amount, request.category);
    }
    
    /**
     * @notice Update allowed spending categories for a student
     * @param student Address of the student
     * @param category Category to update
     * @param allowed Whether the category is allowed
     */
    function updateAllowedCategory(
        address student, 
        SpendingCategory category, 
        bool allowed
    ) external onlyAdmin {
        require(hasWallet[student], "Wallet does not exist");
        wallets[student].allowedCategories[category] = allowed;
        emit CategoryUpdated(student, category, allowed);
    }
    
    /**
     * @notice Emergency withdraw for student (requires admin approval)
     * @param student Address of the student
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address student, uint256 amount) external onlyAdmin nonReentrant {
        require(hasWallet[student], "Wallet does not exist");
        require(wallets[student].balance >= amount, "Insufficient balance");
        
        wallets[student].balance -= amount;
        emit EmergencyWithdraw(student, amount);
    }
    
    /**
     * @notice Get wallet balance
     * @param student Address of the student
     */
    function getBalance(address student) external view returns (uint256) {
        require(hasWallet[student], "Wallet does not exist");
        return wallets[student].balance;
    }
    
    /**
     * @notice Get wallet info
     * @param student Address of the student
     */
    function getWalletInfo(address student) external view returns (
        uint256 balance, 
        uint256 totalSpent,
        bool booksAllowed,
        bool feesAllowed,
        bool suppliesAllowed
    ) {
        require(hasWallet[student], "Wallet does not exist");
        Wallet storage wallet = wallets[student];
        return (
            wallet.balance, 
            wallet.totalSpent,
            wallet.allowedCategories[SpendingCategory.BOOKS],
            wallet.allowedCategories[SpendingCategory.FEES],
            wallet.allowedCategories[SpendingCategory.SUPPLIES]
        );
    }
    
    /**
     * @notice Check if category is allowed for student
     * @param student Address of the student
     * @param category Category to check
     */
    function isCategoryAllowed(address student, SpendingCategory category) external view returns (bool) {
        require(hasWallet[student], "Wallet does not exist");
        return wallets[student].allowedCategories[category];
    }
    
    /**
     * @notice Get spending request details
     * @param requestId ID of the spending request
     */
    function getSpendingRequest(uint256 requestId) external view returns (
        address student,
        uint256 amount,
        SpendingCategory category,
        string memory merchantAddress,
        bool approved,
        bool executed
    ) {
        SpendingRequest storage request = spendingRequests[requestId];
        return (
            request.student,
            request.amount,
            request.category,
            request.merchantAddress,
            request.approved,
            request.executed
        );
    }
    
    // Pause functions
    function pause() external onlyAdmin {
        _pause();
    }
    
    function unpause() external onlyAdmin {
        _unpause();
    }
}