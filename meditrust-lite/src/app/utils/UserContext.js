"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useMetaMask } from './MetaMaskProvider';

// Create context
const UserContext = createContext();

// Clear ALL wallet user types and connection data on startup
if (typeof window !== 'undefined') {
  // Clear all userType entries
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('userType_')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear any connection data
  localStorage.removeItem('mockWalletAddress');
  localStorage.removeItem('lastConnectedAddress');
}

export function UserProvider({ children }) {
  const { 
    account, 
    isConnecting, 
    error: metaMaskError, 
    isMetaMaskInstalled,
    connectToMetaMask,
    disconnectMetaMask,
    useMockWallet
  } = useMetaMask();
  
  const [user, setUser] = useState({
    address: '',
    isConnected: false,
    isLoading: false,
    userType: null, // 'patient' or 'doctor'
  });

  // Update user state when wallet account changes
  useEffect(() => {
    if (account) {
      const storedUserType = localStorage.getItem(`userType_${account}`);
      setUser({
        address: account,
        isConnected: true,
        isLoading: false,
        userType: storedUserType || null,
      });
    } else {
      setUser({
        address: '',
        isConnected: false,
        isLoading: isConnecting,
        userType: null,
      });
    }
  }, [account, isConnecting]);

  const login = async () => {
    setUser(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Try to connect with MetaMask or fall back to mock wallet
      const result = await connectToMetaMask();
      
      if (result.success) {
        const storedUserType = localStorage.getItem(`userType_${result.address}`);
        console.log('Login successful:', { 
          address: result.address, 
          userType: storedUserType,
          isMockWallet: useMockWallet 
        });
        
        // State will be updated by the useEffect watching account changes
        return { success: true };
      } else {
        console.error('Login failed:', result.error);
        
        setUser(prev => ({
          ...prev,
          isLoading: false
        }));
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error in login function:", error);
      
      setUser(prev => ({
        ...prev,
        isLoading: false
      }));
      
      return { success: false, error: error.message || error };
    }
  };

  const logout = () => {
    disconnectMetaMask();
    // Also clear any stored user type for this address
    if (user.address) {
      localStorage.removeItem(`userType_${user.address}`);
    }
    // State will be updated by the useEffect watching account changes
  };

  const setUserType = (type) => {
    if (user.address && typeof window !== 'undefined') {
      localStorage.setItem(`userType_${user.address}`, type);
      setUser(prev => ({ ...prev, userType: type }));
    }
  };

  return (
    <UserContext.Provider value={{ 
      user,
      login,
      logout,
      setUserType,
      isMockWallet: useMockWallet
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for using the user context
export function useUser() {
  return useContext(UserContext);
} 