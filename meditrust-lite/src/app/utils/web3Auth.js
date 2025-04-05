"use client";

// Clear any existing mock wallet data on page load
if (typeof window !== 'undefined') {
  localStorage.removeItem('lastConnectedAddress');
  localStorage.removeItem('mockWalletAddress');
}

export async function connectWallet() {
  console.log('Connecting wallet, ethereum available:', typeof window !== 'undefined' ? !!window.ethereum : false);
  
  // Check for various providers
  if (typeof window !== 'undefined') {
    console.log('Available providers:', {
      ethereum: !!window.ethereum,
      web3: !!window.web3,
      isMetaMask: window.ethereum?.isMetaMask,
      providerName: window.ethereum?.providerName,
    });
  }
  
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    try {
      console.log('Attempting to connect to MetaMask...');
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected to MetaMask:', accounts[0]);
      // Only store real MetaMask addresses
      if (accounts[0]) {
        localStorage.setItem('lastConnectedAddress', accounts[0]);
      }
      return { address: accounts[0], success: true };
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return { error: `Failed to connect to MetaMask: ${error.message}`, success: false };
    }
  } else {
    console.error('MetaMask not installed');
    return { error: 'MetaMask extension not detected. Please install MetaMask from metamask.io and refresh the page.', success: false };
  }
}

export async function getCurrentWalletConnected() {
  console.log('Checking current wallet, ethereum available:', typeof window !== 'undefined' ? !!window.ethereum : false);
  
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      console.log('Current accounts:', accounts);
      if (accounts.length > 0) {
        return { address: accounts[0], success: true };
      } else {
        return { address: '', success: false };
      }
    } catch (error) {
      console.error('Error getting wallet accounts:', error);
      return { address: '', error: `Error getting wallet: ${error.message}`, success: false };
    }
  } else {
    return { address: '', error: 'MetaMask not installed', success: false };
  }
}

export async function signMessage(message, address) {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });
      return { signature, success: true };
    } catch (error) {
      console.error('Error signing message:', error);
      return { error: 'Failed to sign message', success: false };
    }
  } else {
    return { error: 'MetaMask not installed', success: false };
  }
}

// Add event listeners for wallet changes
export function addWalletListener(callback) {
  if (typeof window !== 'undefined' && window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        callback({ address: accounts[0], success: true });
      } else {
        callback({ address: '', success: false });
      }
    });
    
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }
} 