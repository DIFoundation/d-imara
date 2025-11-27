// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * WalletContract - Education wallet with purpose-locked spending
 * Students can only spend tokens on approved categories: books, fees, supplies
 */

contract WalletContract {
    address public owner;
    
    enum SpendingCategory { BOOKS, FEES, SUPPLIES }
    
    struct Wallet {
        uint256 balance;
        uint256 totalSpent;
        SpendingCategory[] allowedCategories;
    }
    
    mapping(address => Wallet) public wallets;
    mapping(address => bool) public hasWallet;
    
    event WalletCreated(address indexed student);
    event CreditsAdded(address indexed student, uint256 amount);
    event CreditsSpent(address indexed student, uint256 amount, SpendingCategory category);
    event WalletLocked(address indexed student);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    /**
     * Create education wallet for a student
     */
    function createWallet(address student) external onlyOwner {
        require(!hasWallet[student], "Wallet already exists");
        
        Wallet storage wallet = wallets[student];
        wallet.balance = 0;
        wallet.totalSpent = 0;
        wallet.allowedCategories = [SpendingCategory.BOOKS, SpendingCategory.FEES, SpendingCategory.SUPPLIES];
        
        hasWallet[student] = true;
        emit WalletCreated(student);
    }
    
    /**
     * Add credits to wallet (from reward system)
     */
    function addCredits(address student, uint256 amount) external onlyOwner {
        require(hasWallet[student], "Wallet does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        wallets[student].balance += amount;
        emit CreditsAdded(student, amount);
    }
    
    /**
     * Spend credits for approved category
     */
    function spendCredits(address student, uint256 amount, uint8 categoryIndex) external onlyOwner {
        require(hasWallet[student], "Wallet does not exist");
        require(amount > 0, "Amount must be greater than 0");
        require(wallets[student].balance >= amount, "Insufficient balance");
        require(categoryIndex < 3, "Invalid category");
        
        wallets[student].balance -= amount;
        wallets[student].totalSpent += amount;
        
        SpendingCategory category = SpendingCategory(categoryIndex);
        emit CreditsSpent(student, amount, category);
    }
    
    /**
     * Get wallet balance
     */
    function getBalance(address student) external view returns (uint256) {
        require(hasWallet[student], "Wallet does not exist");
        return wallets[student].balance;
    }
    
    /**
     * Get wallet info
     */
    function getWalletInfo(address student) external view returns (uint256 balance, uint256 totalSpent) {
        require(hasWallet[student], "Wallet does not exist");
        return (wallets[student].balance, wallets[student].totalSpent);
    }
}
