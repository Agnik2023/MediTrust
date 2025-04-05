"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../utils/UserContext';

export default function Navbar() {
  const { user, login, logout, isMockWallet } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleLogin = async () => {
    setConnectionError(null);
    try {
      const result = await login();
      if (!result.success && result.error) {
        setConnectionError(result.error);
        console.error("Wallet connection error:", result.error);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setConnectionError(error.message || "Unknown error connecting to wallet");
    }
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">MediTrust</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2">
              Home
            </Link>
            
            {user.isConnected && user.userType === 'patient' && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2">
                  Dashboard
                </Link>
                <Link href="/upload" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2">
                  Upload Records
                </Link>
                <Link href="/access" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2">
                  Manage Access
                </Link>
              </>
            )}
            
            {user.isConnected && user.userType === 'doctor' && (
              <>
                <Link href="/doctor-dashboard" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2">
                  Dashboard
                </Link>
                <Link href="/patient-records" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2">
                  Patient Records
                </Link>
              </>
            )}
            
            {user.isConnected && !user.userType && (
              <Link href="/select-role" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2">
                Select Role
              </Link>
            )}
            
            <div className="ml-4">
              {user.isConnected ? (
                <div className="flex items-center space-x-2">
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isMockWallet 
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" 
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}>
                    {formatAddress(user.address)}
                    {isMockWallet && " (Demo)"}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  id="connect-wallet-btn"
                  onClick={handleLogin}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 border-2 border-green-400 shadow-md"
                  title="Connect to wallet"
                >
                  {user.isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
              )}
              
              {connectionError && (
                <div className="absolute mt-2 p-2 bg-red-100 text-red-700 rounded-md text-xs max-w-xs right-0">
                  {connectionError}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Home
            </Link>
            
            {user.isConnected && user.userType === 'patient' && (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                  Dashboard
                </Link>
                <Link href="/upload" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                  Upload Records
                </Link>
                <Link href="/access" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                  Manage Access
                </Link>
              </>
            )}
            
            {user.isConnected && user.userType === 'doctor' && (
              <>
                <Link href="/doctor-dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                  Dashboard
                </Link>
                <Link href="/patient-records" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                  Patient Records
                </Link>
              </>
            )}
            
            {user.isConnected && !user.userType && (
              <Link href="/select-role" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Select Role
              </Link>
            )}
            
            <div className="mt-4 px-3 py-2">
              {user.isConnected ? (
                <div className="flex flex-col space-y-2">
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium text-center ${
                    isMockWallet 
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" 
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}>
                    {formatAddress(user.address)}
                    {isMockWallet && " (Demo)"}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    id="mobile-connect-wallet-btn"
                    onClick={handleLogin}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 border-2 border-green-400 shadow-md"
                  >
                    {user.isLoading ? "Connecting..." : "Connect Wallet"}
                  </button>
                  
                  {connectionError && (
                    <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-xs">
                      {connectionError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 