"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const MetaMaskContext = createContext(null);

export function MetaMaskProvider({ children }) {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [useMockWallet, setUseMockWallet] = useState(false);

  useEffect(() => {
    // Clear any existing wallet data on page load
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockWalletAddress');
      localStorage.removeItem('lastConnectedAddress');
      
      // Only check if MetaMask is installed, but don't connect
      const hasMetaMask = !!window.ethereum && window.ethereum.isMetaMask;
      setIsMetaMaskInstalled(hasMetaMask);
    }
    
    // Add event listeners
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setUseMockWallet(false);
        } else {
          setAccount('');
        }
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    return () => {
      // Clean up listeners
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const connectToMetaMask = async () => {
    setError('');
    setIsConnecting(true);
    
    try {
      // First try to connect to real MetaMask
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnecting(false);
            setUseMockWallet(false);
            return { success: true, address: accounts[0] };
          }
        } catch (err) {
          console.error('Error connecting to MetaMask:', err);
          // Continue to use mock wallet if MetaMask connection fails
        }
      }
      
      // Fallback to mock wallet if no MetaMask or if MetaMask connection failed
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      localStorage.setItem('mockWalletAddress', mockAddress);
      setAccount(mockAddress);
      setIsConnecting(false);
      setUseMockWallet(true);
      return { success: true, address: mockAddress };
      
    } catch (err) {
      console.error('Error in wallet connection:', err);
      setError(err.message || 'Failed to connect to wallet');
      setIsConnecting(false);
      
      // Final fallback to ensure something works
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      localStorage.setItem('mockWalletAddress', mockAddress);
      setAccount(mockAddress);
      setUseMockWallet(true);
      return { success: true, address: mockAddress };
    }
  };

  const disconnectMetaMask = () => {
    setAccount('');
    setUseMockWallet(false);
    localStorage.removeItem('mockWalletAddress');
    localStorage.removeItem('lastConnectedAddress');
  };

  return (
    <MetaMaskContext.Provider 
      value={{ 
        isMetaMaskInstalled, 
        account, 
        isConnecting, 
        error,
        useMockWallet,
        connectToMetaMask,
        disconnectMetaMask
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
}

export function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
} 