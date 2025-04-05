"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../utils/UserContext';
import { getMyRecords, grantAccess } from '../utils/contract';
import Link from 'next/link';

export default function AccessManager() {
  const { user } = useUser();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorAddress, setDoctorAddress] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState('');
  const [isGranting, setIsGranting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user.address) return;
      
      setIsLoading(true);
      try {
        // Fetch records from the blockchain
        const result = await getMyRecords(user.address);
        
        if (result.success) {
          setRecords(result.records);
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [user.address]);

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');
    
    if (!doctorAddress || !selectedRecordId) {
      setErrorMessage('Please select a record and enter a doctor address');
      return;
    }
    
    if (!doctorAddress.startsWith('0x') || doctorAddress.length !== 42) {
      setErrorMessage('Please enter a valid Ethereum address');
      return;
    }
    
    setIsGranting(true);
    
    try {
      const result = await grantAccess(selectedRecordId, user.address, doctorAddress);
      
      if (result.success) {
        setSuccessMessage(`Access granted to ${formatAddress(doctorAddress)}`);
        setDoctorAddress('');
        setSelectedRecordId('');
      } else {
        setErrorMessage(result.error || 'Failed to grant access');
      }
    } catch (error) {
      console.error('Error granting access:', error);
      setErrorMessage('Error granting access: ' + (error.message || 'Unknown error'));
    } finally {
      setIsGranting(false);
    }
  };

  // Helper function to format addresses
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!user.isConnected || user.userType !== 'patient') {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please connect your wallet and ensure you are registered as a patient.
        </p>
        <Link 
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Manage Record Access</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Control which healthcare providers can access your medical records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grant Access Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Grant Access</h2>
            
            <form onSubmit={handleGrantAccess}>
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg">
                  {successMessage}
                </div>
              )}
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
                  {errorMessage}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="doctorAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Healthcare Provider Address
                </label>
                <input
                  type="text"
                  id="doctorAddress"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="0x..."
                  value={doctorAddress}
                  onChange={(e) => setDoctorAddress(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter the Ethereum address of the healthcare provider
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="recordSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Record
                </label>
                <select
                  id="recordSelect"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  value={selectedRecordId}
                  onChange={(e) => setSelectedRecordId(e.target.value)}
                  required
                >
                  <option value="">Select a record</option>
                  {records.map((record, index) => (
                    <option key={record.id || index} value={record.id}>
                      {record.name || `Medical Record #${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                disabled={isGranting || isLoading}
                className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors
                  ${isGranting || isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'}
                `}
              >
                {isGranting ? 'Granting Access...' : 'Grant Access'}
              </button>
            </form>
          </div>
          
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">How It Works</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-3">
                  <span className="text-sm font-bold">1</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enter the Ethereum wallet address of your healthcare provider
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-3">
                  <span className="text-sm font-bold">2</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Select which medical record you want to share
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-3">
                  <span className="text-sm font-bold">3</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  The access permission is stored on the blockchain and can be revoked at any time
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-3">
                  <span className="text-sm font-bold">4</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Only you control who can access your medical records
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Records and Current Access List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Medical Records</h2>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Loading your records...</p>
              </div>
            ) : records.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Record</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Added</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shared With</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {records.map((record, index) => (
                      <tr key={record.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {record.name || `Medical Record #${index + 1}`}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {record.ipfsHash ? record.ipfsHash.substring(0, 10) + '...' : 'IPFS Hash Unavailable'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(record.timestamp) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {record.sharedWith && record.sharedWith.length > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {record.sharedWith.length} Healthcare Provider(s)
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                                Not Shared
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => setSelectedRecordId(record.id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                          >
                            Share
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No records found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">You need to upload medical records before you can grant access.</p>
                <div className="mt-6">
                  <Link
                    href="/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Upload Medical Record
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 