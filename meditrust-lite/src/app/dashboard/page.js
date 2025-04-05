"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../utils/UserContext';

// Sample data for demonstration
const DEMO_RECORDS = [
  { id: 1, name: 'Blood Test Results.pdf', type: 'Lab Test', date: '2023-12-15', size: '2.4 MB' },
  { id: 2, name: 'X-Ray Report.jpg', type: 'Imaging', date: '2023-11-28', size: '5.1 MB' },
  { id: 3, name: 'Prescription.pdf', type: 'Medication', date: '2023-12-05', size: '0.8 MB' },
  { id: 4, name: 'MRI Scan.jpg', type: 'Imaging', date: '2023-10-10', size: '12.2 MB' },
  { id: 5, name: 'Vaccination Record.pdf', type: 'Immunization', date: '2023-09-22', size: '1.5 MB' },
];

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [records, setRecords] = useState(DEMO_RECORDS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // For demo purposes, we're using local data instead of blockchain
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle record viewing - in a real app, this would decrypt and display the record
  const viewRecord = (id) => {
    alert(`Viewing record ${id}. In a complete implementation, this would retrieve and decrypt the record from IPFS.`);
  };

  // Handle record deletion - in a real app, this would update the blockchain
  const deleteRecord = (id) => {
    setRecords(records.filter(record => record.id !== id));
    alert(`Record ${id} deleted. In a complete implementation, this would update the blockchain record list.`);
  };

  // If not connected, show placeholder with quick connect option
  if (!user.isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            You need to connect your MetaMask wallet to access your medical records dashboard.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Medical Records Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Manage all your medical records in one secure place.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => router.push('/upload')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload New Record
          </button>
        </div>
      </div>

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Records</p>
              <p className="text-gray-900 dark:text-white text-2xl font-semibold">{records.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Storage Used</p>
              <p className="text-gray-900 dark:text-white text-2xl font-semibold">22.0 MB</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Shared With</p>
              <p className="text-gray-900 dark:text-white text-2xl font-semibold">2 Doctors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Records table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Your Medical Records</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            All your records are encrypted and stored on IPFS with blockchain verification.
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{record.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => viewRecord(record.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 