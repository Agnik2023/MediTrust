import { create } from 'ipfs-http-client';
import CryptoJS from 'crypto-js';

// Configure IPFS client - using Infura IPFS gateway
const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID || '';
const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET || '';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

/**
 * Encrypts file data with a password
 * @param {ArrayBuffer} fileData - The file data to encrypt
 * @param {string} encryptionKey - The encryption key (patient's wallet address)
 * @returns {string} - The encrypted data as a string
 */
export const encryptData = (fileData, encryptionKey) => {
  // Convert ArrayBuffer to WordArray
  const wordArray = CryptoJS.lib.WordArray.create(fileData);
  
  // Encrypt the data
  const encrypted = CryptoJS.AES.encrypt(wordArray, encryptionKey).toString();
  return encrypted;
};

/**
 * Decrypts encrypted data with a password
 * @param {string} encryptedData - The encrypted data
 * @param {string} encryptionKey - The encryption key (patient's wallet address)
 * @returns {ArrayBuffer} - The decrypted data as an ArrayBuffer
 */
export const decryptData = (encryptedData, encryptionKey) => {
  // Decrypt the data
  const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  
  // Convert to ArrayBuffer
  const typedArray = convertWordArrayToUint8Array(decrypted);
  return typedArray.buffer;
};

/**
 * Helper function to convert CryptoJS WordArray to Uint8Array
 */
function convertWordArrayToUint8Array(wordArray) {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const u8 = new Uint8Array(sigBytes);
  
  for (let i = 0; i < sigBytes; i++) {
    const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    u8[i] = byte;
  }
  
  return u8;
}

/**
 * Uploads encrypted file to IPFS
 * @param {File} file - The file to upload
 * @param {string} walletAddress - User's wallet address for encryption key
 * @returns {Promise<{hash: string, size: number}>} - IPFS hash and file size
 */
export const uploadToIPFS = async (file, walletAddress) => {
  try {
    // Read the file
    const fileData = await readFileAsArrayBuffer(file);
    
    // Encrypt the file with the user's wallet address as the key
    const encryptedData = encryptData(fileData, walletAddress);
    
    // Create a Blob from the encrypted data
    const encryptedBlob = new Blob([encryptedData]);
    
    // Upload to IPFS
    const added = await client.add(
      { content: encryptedBlob },
      {
        progress: (prog) => console.log(`Received: ${prog}`)
      }
    );
    
    // Return the IPFS hash and file size
    return {
      hash: added.path,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};

/**
 * Retrieves and decrypts file from IPFS
 * @param {string} ipfsHash - The IPFS hash of the file
 * @param {string} walletAddress - User's wallet address for decryption key
 * @returns {Promise<ArrayBuffer>} - Decrypted file data
 */
export const retrieveFromIPFS = async (ipfsHash, walletAddress) => {
  try {
    // Get the encrypted data from IPFS
    const chunks = [];
    for await (const chunk of client.cat(ipfsHash)) {
      chunks.push(chunk);
    }
    
    // Combine chunks into a single Uint8Array
    const encryptedData = new TextDecoder().decode(
      new Uint8Array(
        await new Blob(chunks).arrayBuffer()
      )
    );
    
    // Decrypt the data using the wallet address as the key
    const decryptedData = decryptData(encryptedData, walletAddress);
    
    return decryptedData;
  } catch (error) {
    console.error('Error retrieving file from IPFS:', error);
    throw error;
  }
};

/**
 * Helper function to read a file as ArrayBuffer
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export default {
  uploadToIPFS,
  retrieveFromIPFS,
  encryptData,
  decryptData
}; 