"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '../utils/UserContext';

export default function Hero() {
  const { user, login, isMockWallet } = useUser();
  const [connectionError, setConnectionError] = useState(null);

  const handleConnectWallet = async () => {
    setConnectionError(null);
    try {
      const result = await login();
      if (!result.success && result.error) {
        setConnectionError(result.error);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setConnectionError(error.message || "Unknown error connecting to wallet");
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            <span className="block text-blue-600 dark:text-blue-400">Secure</span>
            <span className="block">Medical Records Storage</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-300">
            Store and share your medical records securely using blockchain technology.
            Your data stays private, accessible only with your consent.
          </p>
          
          {connectionError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md mx-auto max-w-lg">
              <p className="font-medium">Connection Error:</p>
              <p>{connectionError}</p>
              <p className="text-xs mt-1">Make sure MetaMask is installed and unlocked</p>
            </div>
          )}

          {!user.isConnected && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md mx-auto max-w-lg">
              <p className="font-bold">Connect Your Wallet</p>
              <p className="text-sm">Please connect your wallet to access the MediTrust platform.</p>
            </div>
          )}

          {user.isConnected && isMockWallet && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md mx-auto max-w-lg">
              <p className="font-bold">Using Demo Wallet</p>
              <p className="text-sm">MetaMask not detected. Using a temporary wallet for demo purposes.</p>
            </div>
          )}
          
          <div className="mt-10 flex justify-center gap-4 flex-col sm:flex-row">
            {user.isConnected ? (
              <Link 
                href={user.userType ? (user.userType === 'patient' ? '/dashboard' : '/doctor-dashboard') : '/select-role'}
                className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 relative overflow-hidden group"
              >
                <span className="absolute right-full w-12 h-full transform translate-x-12 bg-white opacity-10 transform -skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-96"></span>
                {user.userType ? (user.userType === 'patient' ? 'View Dashboard' : 'View Doctor Dashboard') : 'Select Role'}
              </Link>
            ) : (
              <button 
                onClick={handleConnectWallet}
                className="px-8 py-3 text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 relative overflow-hidden group animate-pulse"
                id="connect-wallet-btn"
              >
                <span className="absolute right-full w-12 h-full transform translate-x-12 bg-white opacity-10 transform -skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-96"></span>
                {user.isLoading ? "Connecting..." : "👉 Click to Connect Wallet 👈"}
              </button>
            )}
            <Link 
              href="#how-it-works"
              className="px-8 py-3 text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 md:py-4 md:text-lg md:px-10"
            >
              Learn More
            </Link>
          </div>
          
          {!user.isConnected && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Don't have MetaMask? We'll use a demo wallet for you
              </a>
            </p>
          )}
        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white dark:from-gray-900" />
    </div>
  );
} 