"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../utils/UserContext';
import { getDoctorAccessibleRecords } from '../utils/contract';
import Link from 'next/link';

export default function DoctorDashboard() {
  const { user } = useUser();
  const [patientRecords, setPatientRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalRecords: 0,
    recentlyViewed: 0
  });

  useEffect(() => {
    const fetchAccessibleRecords = async () => {
      if (!user.address) return;
      
      setIsLoading(true);
      try {
        // Fetch records that the doctor has access to
        const result = await getDoctorAccessibleRecords(user.address);
        
        if (result.success) {
          setPatientRecords(result.records);
          
          // Calculate stats
          const uniquePatients = new Set();
          result.records.forEach(record => {
            uniquePatients.add(record.owner);
          });
          
          setStats({
            totalPatients: uniquePatients.size,
            totalRecords: result.records.length,
            recentlyViewed: Math.min(3, result.records.length) // Just for demo
          });
        }
      } catch (error) {
        console.error('Error fetching accessible records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccessibleRecords();
  }, [user.address]);

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

  // Filter records based on search term
  const filteredRecords = patientRecords.filter(record => {
    const patientAddress = record.owner ? record.owner.toLowerCase() : '';
    const recordName = record.name ? record.name.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    
    return patientAddress.includes(search) || recordName.includes(search);
  });

  // Group records by patient for display
  const recordsByPatient = filteredRecords.reduce((acc, record) => {
    if (!acc[record.owner]) {
      acc[record.owner] = [];
    }
    acc[record.owner].push(record);
    return acc;
  }, {});

  if (!user.isConnected || user.userType !== 'doctor') {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please connect your wallet and ensure you are registered as a healthcare provider.
        </p>
        <Link 
          href="/"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Healthcare Provider Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Access and manage patient medical records
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Patients</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalPatients}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total patients</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Records</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalRecords}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Accessible medical records</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.recentlyViewed}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Recently viewed records</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <div className="max-w-lg">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Patient Records
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Search by patient address or record name"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Patient Records */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Patient Records</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading patient records...</p>
          </div>
        ) : Object.keys(recordsByPatient).length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(recordsByPatient).map(([patientAddress, records]) => (
              <div key={patientAddress} className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Patient: {formatAddress(patientAddress)}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{records.length} medical record(s)</p>
                  </div>
                </div>
                
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Record</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {records.map((record, index) => (
                        <tr key={record.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {record.name || `Medical Record #${index + 1}`}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {record.ipfsHash ? record.ipfsHash.substring(0, 10) + '...' : 'IPFS Hash Unavailable'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(record.timestamp) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {record.type || 'Medical Record'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">View</button>
                            <button className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300">Notes</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No patient records found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No matching records for your search.' : 'You have not been granted access to any patient records yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 