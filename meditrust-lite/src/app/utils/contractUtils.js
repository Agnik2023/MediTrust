import { ethers } from 'ethers';
import MediTrustArtifact from '../artifacts/contracts/MediTrust.sol/MediTrust.json';

// Contract address will be set after deployment
let contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

/**
 * Get the Ethereum provider and signer
 * @returns {Promise<{provider: ethers.providers.Web3Provider, signer: ethers.Signer}>}
 */
export const getProviderAndSigner = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
  }

  // Request account access
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  return { provider, signer };
};

/**
 * Get the MediTrust contract instance
 * @param {ethers.Signer} signer - The signer to use for transactions
 * @returns {Promise<ethers.Contract>}
 */
export const getContract = async (signer) => {
  if (!contractAddress) {
    throw new Error('Contract address not set. Please deploy the contract first.');
  }
  
  const contract = new ethers.Contract(
    contractAddress,
    MediTrustArtifact.abi,
    signer
  );
  
  return contract;
};

/**
 * Set the contract address (used after deployment)
 * @param {string} address - The deployed contract address
 */
export const setContractAddress = (address) => {
  contractAddress = address;
  
  // Also save to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediTrustContractAddress', address);
  }
};

/**
 * Initialize contract address from localStorage if available
 */
export const initContractAddress = () => {
  if (typeof window !== 'undefined') {
    const savedAddress = localStorage.getItem('mediTrustContractAddress');
    if (savedAddress) {
      contractAddress = savedAddress;
    }
  }
};

/**
 * Add a medical record to the blockchain
 * @param {string} ipfsHash - The IPFS hash of the encrypted record
 * @param {string} recordType - The type of medical record
 * @param {number} fileSize - The size of the file in bytes
 * @returns {Promise<ethers.ContractTransaction>}
 */
export const addRecord = async (ipfsHash, recordType, fileSize) => {
  try {
    const { signer } = await getProviderAndSigner();
    const contract = await getContract(signer);
    
    const tx = await contract.addRecord(ipfsHash, recordType, fileSize);
    await tx.wait();
    
    return tx;
  } catch (error) {
    console.error('Error adding record to blockchain:', error);
    throw error;
  }
};

/**
 * Grant access to a medical record
 * @param {number} recordId - The ID of the record
 * @param {string} doctorAddress - The Ethereum address of the doctor
 * @returns {Promise<ethers.ContractTransaction>}
 */
export const grantAccess = async (recordId, doctorAddress) => {
  try {
    const { signer } = await getProviderAndSigner();
    const contract = await getContract(signer);
    
    const tx = await contract.grantAccess(recordId, doctorAddress);
    await tx.wait();
    
    return tx;
  } catch (error) {
    console.error('Error granting access:', error);
    throw error;
  }
};

/**
 * Revoke access to a medical record
 * @param {number} recordId - The ID of the record
 * @param {string} doctorAddress - The Ethereum address of the doctor
 * @returns {Promise<ethers.ContractTransaction>}
 */
export const revokeAccess = async (recordId, doctorAddress) => {
  try {
    const { signer } = await getProviderAndSigner();
    const contract = await getContract(signer);
    
    const tx = await contract.revokeAccess(recordId, doctorAddress);
    await tx.wait();
    
    return tx;
  } catch (error) {
    console.error('Error revoking access:', error);
    throw error;
  }
};

/**
 * Check if an address has access to a record
 * @param {number} recordId - The ID of the record
 * @param {string} address - The Ethereum address to check
 * @returns {Promise<boolean>}
 */
export const hasAccess = async (recordId, address) => {
  try {
    const { signer } = await getProviderAndSigner();
    const contract = await getContract(signer);
    
    const hasAccess = await contract.hasAccess(recordId, address);
    return hasAccess;
  } catch (error) {
    console.error('Error checking access:', error);
    throw error;
  }
};

/**
 * Get the details of a medical record
 * @param {number} recordId - The ID of the record
 * @returns {Promise<{ipfsHash: string, owner: string, timestamp: number, recordType: string, size: number}>}
 */
export const getRecord = async (recordId) => {
  try {
    const { signer } = await getProviderAndSigner();
    const contract = await getContract(signer);
    
    const record = await contract.getRecord(recordId);
    
    return {
      ipfsHash: record.ipfsHash,
      owner: record.owner,
      timestamp: Number(record.timestamp),
      recordType: record.recordType,
      size: Number(record.size)
    };
  } catch (error) {
    console.error('Error getting record:', error);
    throw error;
  }
};

/**
 * Get all records owned by the current user
 * @returns {Promise<Array<{id: number, ipfsHash: string, timestamp: number, recordType: string, size: number}>>}
 */
export const getMyRecords = async () => {
  try {
    const { signer } = await getProviderAndSigner();
    const contract = await getContract(signer);
    
    const records = await contract.getMyRecords();
    
    return records.map((record, index) => ({
      id: index,
      ipfsHash: record.ipfsHash,
      timestamp: Number(record.timestamp),
      recordType: record.recordType,
      size: Number(record.size)
    }));
  } catch (error) {
    console.error('Error getting my records:', error);
    throw error;
  }
};

/**
 * Get all records the current user has access to
 * @returns {Promise<Array<{id: number, ipfsHash: string, owner: string, timestamp: number, recordType: string, size: number}>>}
 */
export const getAccessibleRecords = async () => {
  try {
    const { signer } = await getProviderAndSigner();
    const contract = await getContract(signer);
    
    const records = await contract.getAccessibleRecords();
    
    return records.map((record, index) => ({
      id: index,
      ipfsHash: record.ipfsHash,
      owner: record.owner,
      timestamp: Number(record.timestamp),
      recordType: record.recordType,
      size: Number(record.size)
    }));
  } catch (error) {
    console.error('Error getting accessible records:', error);
    throw error;
  }
};

export default {
  getProviderAndSigner,
  getContract,
  setContractAddress,
  initContractAddress,
  addRecord,
  grantAccess,
  revokeAccess,
  hasAccess,
  getRecord,
  getMyRecords,
  getAccessibleRecords
}; 