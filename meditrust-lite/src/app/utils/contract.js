"use client";

// Mock blockchain contract interface for demo
// In a real app, you would interact with an actual deployed smart contract

// In-memory storage to simulate blockchain
const recordsStore = [];
const accessStore = {};

export async function uploadRecordToBlockchain(ipfsHash, owner) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const recordId = recordsStore.length;
      recordsStore.push({
        id: recordId,
        ipfsHash,
        owner,
        timestamp: new Date().toISOString()
      });
      
      // Initialize empty access list for this record
      accessStore[recordId] = [];
      
      resolve({
        success: true,
        recordId,
        txHash: '0x' + Array(64).fill(0).map(() => 
          '0123456789abcdef'.charAt(Math.floor(Math.random() * 16))
        ).join('')
      });
    }, 1500); // 1.5 second delay to simulate blockchain transaction
  });
}

export async function getMyRecords(address) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const records = recordsStore.filter(record => record.owner === address);
      resolve({
        success: true,
        records
      });
    }, 1000);
  });
}

export async function grantAccess(recordId, ownerAddress, doctorAddress) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const record = recordsStore[recordId];
      
      if (!record) {
        reject({ success: false, error: 'Record not found' });
        return;
      }
      
      if (record.owner !== ownerAddress) {
        reject({ success: false, error: 'Not authorized' });
        return;
      }
      
      // Add doctor to access list if not already present
      if (!accessStore[recordId].includes(doctorAddress)) {
        accessStore[recordId].push(doctorAddress);
      }
      
      resolve({
        success: true,
        txHash: '0x' + Array(64).fill(0).map(() => 
          '0123456789abcdef'.charAt(Math.floor(Math.random() * 16))
        ).join('')
      });
    }, 1500);
  });
}

export async function checkAccess(recordId, address) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = recordsStore[recordId];
      
      if (!record) {
        resolve({ success: false, hasAccess: false, error: 'Record not found' });
        return;
      }
      
      // Check if requester is the owner
      if (record.owner === address) {
        resolve({ success: true, hasAccess: true, isOwner: true });
        return;
      }
      
      // Check if requester has been granted access
      const hasAccess = accessStore[recordId]?.includes(address) || false;
      
      resolve({
        success: true,
        hasAccess,
        isOwner: false
      });
    }, 500);
  });
}

export async function getDoctorAccessibleRecords(doctorAddress) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accessibleRecords = [];
      
      // Check all records for doctor access
      Object.keys(accessStore).forEach(recordId => {
        if (accessStore[recordId].includes(doctorAddress)) {
          accessibleRecords.push({
            ...recordsStore[recordId],
            accessType: 'Granted'
          });
        }
      });
      
      resolve({
        success: true,
        records: accessibleRecords
      });
    }, 1000);
  });
} 