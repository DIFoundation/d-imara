// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * FundingPool - Collects donor funds and distributes them based on student performance
 * Maintains transparent ledger of all transactions
 */

contract FundingPool {
    address public owner;
    
    struct Disbursement {
        address student;
        uint256 amount;
        string school;
        uint256 timestamp;
        bool approved;
    }
    
    struct Donor {
        address walletAddress;
        string organization;
        uint256 totalContributed;
    }
    
    Disbursement[] public disbursements;
    mapping(address => Donor) public donors;
    mapping(string => uint256) public schoolFunds;
    
    uint256 public totalPoolBalance;
    
    event DonationReceived(address indexed donor, uint256 amount, string school);
    event DisbursementApproved(address indexed student, uint256 amount, string school);
    event DisbursementRejected(address indexed student, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    /**
     * Register a donor
     */
    function registerDonor(address donor, string memory organization) external onlyOwner {
        donors[donor] = Donor({
            walletAddress: donor,
            organization: organization,
            totalContributed: 0
        });
    }
    
    /**
     * Receive donation for a specific school
     */
    function donateForSchool(string memory school, uint256 amount) external {
        require(amount > 0, "Donation amount must be greater than 0");
        
        schoolFunds[school] += amount;
        totalPoolBalance += amount;
        
        if (donors[msg.sender].walletAddress != address(0)) {
            donors[msg.sender].totalContributed += amount;
        }
        
        emit DonationReceived(msg.sender, amount, school);
    }
    
    /**
     * Approve disbursement to a student
     */
    function approveDisbursement(address student, uint256 amount, string memory school) external onlyOwner {
        require(schoolFunds[school] >= amount, "Insufficient school funds");
        require(amount > 0, "Amount must be greater than 0");
        
        schoolFunds[school] -= amount;
        totalPoolBalance -= amount;
        
        Disbursement memory newDisbursement = Disbursement({
            student: student,
            amount: amount,
            school: school,
            timestamp: block.timestamp,
            approved: true
        });
        
        disbursements.push(newDisbursement);
        emit DisbursementApproved(student, amount, school);
    }
    
    /**
     * Get total disbursements made
     */
    function getTotalDisbursements() external view returns (uint256) {
        return disbursements.length;
    }
    
    /**
     * Get school fund balance
     */
    function getSchoolBalance(string memory school) external view returns (uint256) {
        return schoolFunds[school];
    }
    
    /**
     * Get pool info
     */
    function getPoolInfo() external view returns (uint256 total, uint256 disbursementCount) {
        return (totalPoolBalance, disbursements.length);
    }
}
