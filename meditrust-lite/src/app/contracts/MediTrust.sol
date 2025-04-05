// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MediTrust {
    // Events
    event RecordAdded(uint256 indexed recordId, address indexed owner, string ipfsHash);
    event AccessGranted(uint256 indexed recordId, address indexed owner, address indexed doctor);
    event AccessRevoked(uint256 indexed recordId, address indexed owner, address indexed doctor);
    
    // Struct for medical records
    struct Record {
        string ipfsHash;
        address owner;
        uint256 timestamp;
        string recordType;
        uint256 size;
    }
    
    // Maps record ID to Record struct
    mapping(uint256 => Record) private records;
    
    // Maps record ID to authorized doctors
    mapping(uint256 => mapping(address => bool)) private recordAccess;
    
    // Total number of records
    uint256 public recordCount;
    
    // Modifiers
    modifier onlyOwner(uint256 _recordId) {
        require(records[_recordId].owner == msg.sender, "Not the owner");
        _;
    }
    
    modifier recordExists(uint256 _recordId) {
        require(_recordId < recordCount && records[_recordId].owner != address(0), "Record does not exist");
        _;
    }
    
    // Functions
    
    /**
     * @dev Add a new medical record
     * @param _ipfsHash IPFS hash of the record
     * @param _recordType Type of the record
     * @param _size Size of the record in bytes
     */
    function addRecord(string memory _ipfsHash, string memory _recordType, uint256 _size) public {
        uint256 recordId = recordCount;
        
        records[recordId] = Record({
            ipfsHash: _ipfsHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            recordType: _recordType,
            size: _size
        });
        
        recordCount++;
        
        emit RecordAdded(recordId, msg.sender, _ipfsHash);
    }
    
    /**
     * @dev Grant access to a doctor for a specific record
     * @param _recordId ID of the record
     * @param _doctor Address of the doctor
     */
    function grantAccess(uint256 _recordId, address _doctor) public onlyOwner(_recordId) recordExists(_recordId) {
        require(_doctor != address(0), "Invalid doctor address");
        require(!recordAccess[_recordId][_doctor], "Access already granted");
        
        recordAccess[_recordId][_doctor] = true;
        
        emit AccessGranted(_recordId, msg.sender, _doctor);
    }
    
    /**
     * @dev Revoke access from a doctor for a specific record
     * @param _recordId ID of the record
     * @param _doctor Address of the doctor
     */
    function revokeAccess(uint256 _recordId, address _doctor) public onlyOwner(_recordId) recordExists(_recordId) {
        require(recordAccess[_recordId][_doctor], "Access not granted");
        
        recordAccess[_recordId][_doctor] = false;
        
        emit AccessRevoked(_recordId, msg.sender, _doctor);
    }
    
    /**
     * @dev Check if a doctor has access to a specific record
     * @param _recordId ID of the record
     * @param _doctor Address of the doctor
     * @return bool Whether the doctor has access
     */
    function hasAccess(uint256 _recordId, address _doctor) public view recordExists(_recordId) returns (bool) {
        return records[_recordId].owner == _doctor || recordAccess[_recordId][_doctor];
    }
    
    /**
     * @dev Get record details
     * @param _recordId ID of the record
     * @return ipfsHash IPFS hash of the record
     * @return owner Address of the record owner
     * @return timestamp Timestamp when the record was added
     * @return recordType Type of the record
     * @return size Size of the record in bytes
     */
    function getRecord(uint256 _recordId) public view recordExists(_recordId) returns (
        string memory ipfsHash,
        address owner,
        uint256 timestamp,
        string memory recordType,
        uint256 size
    ) {
        Record storage record = records[_recordId];
        
        // Only owner or authorized doctors can access the record
        require(record.owner == msg.sender || recordAccess[_recordId][msg.sender], "Not authorized");
        
        return (
            record.ipfsHash,
            record.owner,
            record.timestamp,
            record.recordType,
            record.size
        );
    }
    
    /**
     * @dev Get all records owned by the caller
     * @return uint256[] Array of record IDs
     */
    function getMyRecords() public view returns (uint256[] memory) {
        uint256 myRecordCount = 0;
        
        // Count user's records
        for (uint256 i = 0; i < recordCount; i++) {
            if (records[i].owner == msg.sender) {
                myRecordCount++;
            }
        }
        
        uint256[] memory myRecords = new uint256[](myRecordCount);
        uint256 index = 0;
        
        // Collect user's records
        for (uint256 i = 0; i < recordCount; i++) {
            if (records[i].owner == msg.sender) {
                myRecords[index] = i;
                index++;
            }
        }
        
        return myRecords;
    }
    
    /**
     * @dev Get all records a doctor has access to
     * @return uint256[] Array of record IDs
     */
    function getAccessibleRecords() public view returns (uint256[] memory) {
        uint256 accessibleCount = 0;
        
        // Count accessible records
        for (uint256 i = 0; i < recordCount; i++) {
            if (records[i].owner != msg.sender && recordAccess[i][msg.sender]) {
                accessibleCount++;
            }
        }
        
        uint256[] memory accessibleRecords = new uint256[](accessibleCount);
        uint256 index = 0;
        
        // Collect accessible records
        for (uint256 i = 0; i < recordCount; i++) {
            if (records[i].owner != msg.sender && recordAccess[i][msg.sender]) {
                accessibleRecords[index] = i;
                index++;
            }
        }
        
        return accessibleRecords;
    }
} 