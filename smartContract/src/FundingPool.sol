// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FundingPool
 * @notice Collects donor funds and distributes them based on student performance
 * @dev Maintains transparent ledger of all transactions with ETH handling
 */

contract FundingPool is Pausable, ReentrancyGuard, AccessControl {
    
    struct Disbursement {
        address student;
        uint256 amount;
        string school;
        uint256 timestamp;
        bool approved;
        bool executed;
        string purpose;
    }
    
    struct Donor {
        address walletAddress;
        string organization;
        uint256 totalContributed;
        uint256 donationCount;
    }
    
    Disbursement[] public disbursements;
    mapping(address => Donor) public donors;
    mapping(string => uint256) public schoolFunds;
    mapping(address => uint256) public studentDisbursements;
    
    uint256 public totalPoolBalance;
    uint256 public totalDisbursed;
    uint256 public minDonationAmount = 0.001 ether;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    
    event DonationReceived(address indexed donor, uint256 amount, string school);
    event DisbursementRequested(uint256 indexed disbursementId, address indexed student, uint256 amount, string school);
    event DisbursementApproved(uint256 indexed disbursementId, address indexed student, uint256 amount, string school);
    event DisbursementExecuted(uint256 indexed disbursementId, address indexed student, uint256 amount);
    event DisbursementRejected(uint256 indexed disbursementId, address indexed student, uint256 amount);
    event DonorRegistered(address indexed donor, string organization);
    event MinDonationUpdated(uint256 oldAmount, uint256 newAmount);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(TREASURER_ROLE, msg.sender);
    }
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not admin");
        _;
    }
    
    modifier onlyTreasurer() {
        require(hasRole(TREASURER_ROLE, msg.sender), "Caller is not treasurer");
        _;
    }
    
    /**
     * @notice Register a donor with organization details
     * @param donor Address of the donor
     * @param organization Name of the organization
     */
    function registerDonor(address donor, string memory organization) external onlyAdmin {
        require(donor != address(0), "Invalid donor address");
        require(bytes(organization).length > 0, "Organization name required");
        
        donors[donor] = Donor({
            walletAddress: donor,
            organization: organization,
            totalContributed: 0,
            donationCount: 0
        });
        
        emit DonorRegistered(donor, organization);
    }
    
    /**
     * @notice Donate ETH for a specific school
     * @param school Name of the school
     */
    function donateForSchool(string memory school) external payable whenNotPaused nonReentrant {
        require(msg.value >= minDonationAmount, "Donation below minimum");
        require(bytes(school).length > 0, "School name required");
        
        schoolFunds[school] += msg.value;
        totalPoolBalance += msg.value;
        
        // Update donor stats if registered
        if (donors[msg.sender].walletAddress != address(0)) {
            donors[msg.sender].totalContributed += msg.value;
            donors[msg.sender].donationCount += 1;
        }
        
        emit DonationReceived(msg.sender, msg.value, school);
    }
    
    /**
     * @notice General donation to the pool
     */
    function donate() external payable whenNotPaused nonReentrant {
        require(msg.value >= minDonationAmount, "Donation below minimum");
        
        totalPoolBalance += msg.value;
        
        if (donors[msg.sender].walletAddress != address(0)) {
            donors[msg.sender].totalContributed += msg.value;
            donors[msg.sender].donationCount += 1;
        }
        
        emit DonationReceived(msg.sender, msg.value, "General Pool");
    }
    
    /**
     * @notice Request disbursement to a student (creates pending request)
     * @param student Address of the student
     * @param amount Amount to disburse
     * @param school School name
     * @param purpose Purpose of disbursement
     */
    function requestDisbursement(
        address student,
        uint256 amount,
        string memory school,
        string memory purpose
    ) external onlyTreasurer whenNotPaused returns (uint256) {
        require(student != address(0), "Invalid student address");
        require(amount > 0, "Amount must be greater than 0");
        require(schoolFunds[school] >= amount, "Insufficient school funds");
        require(bytes(school).length > 0, "School name required");
        
        uint256 disbursementId = disbursements.length;
        
        disbursements.push(Disbursement({
            student: student,
            amount: amount,
            school: school,
            timestamp: block.timestamp,
            approved: false,
            executed: false,
            purpose: purpose
        }));
        
        emit DisbursementRequested(disbursementId, student, amount, school);
        return disbursementId;
    }
    
    /**
     * @notice Approve and execute disbursement to a student
     * @param disbursementId ID of the disbursement request
     */
    function approveDisbursement(uint256 disbursementId) external onlyAdmin whenNotPaused nonReentrant {
        require(disbursementId < disbursements.length, "Invalid disbursement ID");
        
        Disbursement storage disbursement = disbursements[disbursementId];
        require(!disbursement.approved, "Already approved");
        require(!disbursement.executed, "Already executed");
        require(schoolFunds[disbursement.school] >= disbursement.amount, "Insufficient school funds");
        require(address(this).balance >= disbursement.amount, "Insufficient contract balance");
        
        // Mark as approved
        disbursement.approved = true;
        
        emit DisbursementApproved(disbursementId, disbursement.student, disbursement.amount, disbursement.school);
    }
    
    /**
     * @notice Execute approved disbursement (transfer funds)
     * @param disbursementId ID of the disbursement request
     */
    function executeDisbursement(uint256 disbursementId) external onlyTreasurer whenNotPaused nonReentrant {
        require(disbursementId < disbursements.length, "Invalid disbursement ID");
        
        Disbursement storage disbursement = disbursements[disbursementId];
        require(disbursement.approved, "Not approved");
        require(!disbursement.executed, "Already executed");
        require(address(this).balance >= disbursement.amount, "Insufficient balance");
        
        // Update accounting
        schoolFunds[disbursement.school] -= disbursement.amount;
        totalPoolBalance -= disbursement.amount;
        totalDisbursed += disbursement.amount;
        studentDisbursements[disbursement.student] += disbursement.amount;
        
        // Mark as executed
        disbursement.executed = true;
        
        // Transfer funds
        (bool success, ) = disbursement.student.call{value: disbursement.amount}("");
        require(success, "Transfer failed");
        
        emit DisbursementExecuted(disbursementId, disbursement.student, disbursement.amount);
    }
    
    /**
     * @notice Reject a disbursement request
     * @param disbursementId ID of the disbursement request
     */
    function rejectDisbursement(uint256 disbursementId) external onlyAdmin {
        require(disbursementId < disbursements.length, "Invalid disbursement ID");
        
        Disbursement storage disbursement = disbursements[disbursementId];
        require(!disbursement.approved, "Already approved");
        require(!disbursement.executed, "Already executed");
        
        emit DisbursementRejected(disbursementId, disbursement.student, disbursement.amount);
    }
    
    /**
     * @notice Batch approve multiple disbursements
     * @param disbursementIds Array of disbursement IDs
     */
    function batchApproveDisbursements(uint256[] calldata disbursementIds) external onlyAdmin whenNotPaused {
        require(disbursementIds.length <= 50, "Batch size too large");
        
        for (uint256 i = 0; i < disbursementIds.length; i++) {
            uint256 id = disbursementIds[i];
            if (id < disbursements.length && !disbursements[id].approved && !disbursements[id].executed) {
                disbursements[id].approved = true;
                emit DisbursementApproved(
                    id, 
                    disbursements[id].student, 
                    disbursements[id].amount, 
                    disbursements[id].school
                );
            }
        }
    }
    
    /**
     * @notice Update minimum donation amount
     * @param newMinimum New minimum donation amount
     */
    function updateMinDonation(uint256 newMinimum) external onlyAdmin {
        uint256 oldAmount = minDonationAmount;
        minDonationAmount = newMinimum;
        emit MinDonationUpdated(oldAmount, newMinimum);
    }
    
    /**
     * @notice Get total disbursements count
     */
    function getTotalDisbursements() external view returns (uint256) {
        return disbursements.length;
    }
    
    /**
     * @notice Get school fund balance
     * @param school Name of the school
     */
    function getSchoolBalance(string memory school) external view returns (uint256) {
        return schoolFunds[school];
    }
    
    /**
     * @notice Get pool info
     */
    function getPoolInfo() external view returns (
        uint256 balance,
        uint256 disbursed,
        uint256 disbursementCount,
        uint256 contractBalance
    ) {
        return (
            totalPoolBalance,
            totalDisbursed,
            disbursements.length,
            address(this).balance
        );
    }
    
    /**
     * @notice Get donor information
     * @param donor Address of the donor
     */
    function getDonorInfo(address donor) external view returns (
        string memory organization,
        uint256 totalContributed,
        uint256 donationCount
    ) {
        Donor memory d = donors[donor];
        return (d.organization, d.totalContributed, d.donationCount);
    }
    
    /**
     * @notice Get student total disbursements
     * @param student Address of the student
     */
    function getStudentDisbursements(address student) external view returns (uint256) {
        return studentDisbursements[student];
    }
    
    /**
     * @notice Get disbursement details
     * @param disbursementId ID of the disbursement
     */
    function getDisbursementDetails(uint256 disbursementId) external view returns (
        address student,
        uint256 amount,
        string memory school,
        uint256 timestamp,
        bool approved,
        bool executed,
        string memory purpose
    ) {
        require(disbursementId < disbursements.length, "Invalid ID");
        Disbursement memory d = disbursements[disbursementId];
        return (d.student, d.amount, d.school, d.timestamp, d.approved, d.executed, d.purpose);
    }
    
    /**
     * @notice Get pending disbursements (approved but not executed)
     */
    function getPendingDisbursements() external view returns (uint256[] memory) {
        uint256 pendingCount = 0;
        
        // Count pending
        for (uint256 i = 0; i < disbursements.length; i++) {
            if (disbursements[i].approved && !disbursements[i].executed) {
                pendingCount++;
            }
        }
        
        // Populate array
        uint256[] memory pending = new uint256[](pendingCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < disbursements.length; i++) {
            if (disbursements[i].approved && !disbursements[i].executed) {
                pending[index] = i;
                index++;
            }
        }
        
        return pending;
    }
    
    // Emergency functions
    function pause() external onlyAdmin {
        _pause();
    }
    
    function unpause() external onlyAdmin {
        _unpause();
    }
    
    /**
     * @notice Emergency withdrawal (only admin, requires multi-sig in production)
     * @param recipient Address to send funds to
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address payable recipient, uint256 amount) external onlyAdmin nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(address(this).balance >= amount, "Insufficient balance");
        
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // Receive ETH
    receive() external payable {
        totalPoolBalance += msg.value;
        emit DonationReceived(msg.sender, msg.value, "Direct Transfer");
    }
}