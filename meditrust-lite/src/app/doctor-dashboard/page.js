"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../utils/UserContext';

// Sample data for demonstration
const DEMO_PATIENTS = [
  { 
    id: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    name: 'Patient 0x1a2b...9s0t',
    recordCount: 3,
    lastAccessed: '2023-12-18'
  },
  { 
    id: '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a',
    name: 'Patient 0x9s8r...2b1a',
    recordCount: 5,
    lastAccessed: '2023-12-15'
  },
];

const DEMO_RECORDS = [
  { id: 1, name: 'Blood Test Results.pdf', patientId: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t', patientName: 'Patient 0x1a2b...9s0t', type: 'Lab Test', date: '2023-12-15', size: '2.4 MB' },
  { id: 2, name: 'X-Ray Report.jpg', patientId: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t', patientName: 'Patient 0x1a2b...9s0t', type: 'Imaging', date: '2023-11-28', size: '5.1 MB' },
  { id: 3, name: 'Prescription.pdf', patientId: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t', patientName: 'Patient 0x1a2b...9s0t', type: 'Medication', date: '2023-12-05', size: '0.8 MB' },
  { id: 4, name: 'MRI Scan.jpg', patientId: '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a', patientName: 'Patient 0x9s8r...2b1a', type: 'Imaging', date: '2023-10-10', size: '12.2 MB' },
  { id: 5, name: 'Vaccination Record.pdf', patientId: '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a', patientName: 'Patient 0x9s8r...2b1a', type: 'Immunization', date: '2023-09-22', size: '1.5 MB' },
  { id: 6, name: 'Medical History.pdf', patientId: '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a', patientName: 'Patient 0x9s8r...2b1a', type: 'History', date: '2023-11-15', size: '3.2 MB' },
  { id: 7, name: 'Lab Results 2023.pdf', patientId: '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a', patientName: 'Patient 0x9s8r...2b1a', type: 'Lab Test', date: '2023-12-01', size: '1.8 MB' },
  { id: 8, name: 'Cardiology Report.pdf', patientId: '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a', patientName: 'Patient 0x9s8r...2b1a', type: 'Specialist', date: '2023-11-05', size: '2.1 MB' },
];

export default function DoctorDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [patients, setPatients] = useState(DEMO_PATIENTS);
  const [records, setRecords] = useState(DEMO_RECORDS);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // For demo purposes, we're using local data instead of blockchain
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter records based on selected patient
  const filteredRecords = selectedPatient 
    ? records.filter(record => record.patientId === selectedPatient.id)
    : records;

  // Filter records and patients based on search query
  const searchResults = searchQuery 
    ? filteredRecords.filter(record => 
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredRecords;

  // Handle record viewing - in a real app, this would decrypt and display the record
  const viewRecord = (id) => {
    alert(`Viewing record ${id}. In a complete implementation, this would retrieve and decrypt the record from IPFS.`);
  };

  // If not connected, show placeholder with quick connect option
  if (!user.isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            You need to connect your MetaMask wallet to access the healthcare provider dashboard.
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

  // If user is not a doctor, redirect them to role selection
  if (user.userType !== 'doctor') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Unauthorized Access</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            This dashboard is only accessible to healthcare providers.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.href = '/select-role'}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Change Role
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Healthcare Provider Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Access and manage patient medical records.
          </p>
        </div>
      </div>

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
              <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Patients</p>
              <p className="text-gray-900 dark:text-white text-2xl font-semibold">{patients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Accessible Records</p>
              <p className="text-gray-900 dark:text-white text-2xl font-semibold">{records.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Last Activity</p>
              <p className="text-gray-900 dark:text-white text-2xl font-semibold">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient list and record view */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Patients
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Select a patient to view their records
              </p>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="px-4 py-3">
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className={`w-full text-left ${!selectedPatient ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  View All Records
                </button>
              </li>
              {patients.map((patient) => (
                <li key={patient.id} className="px-4 py-3">
                  <button 
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full text-left ${selectedPatient?.id === patient.id ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{patient.name}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        {patient.recordCount} records
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last accessed: {patient.lastAccessed}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Records main content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {selectedPatient ? `Records for ${selectedPatient.name}` : 'All Accessible Records'}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {selectedPatient 
                      ? `Viewing ${filteredRecords.length} records shared by this patient`
                      : `Viewing all ${records.length} records you have access to`
                    }
                  </p>
                </div>
                <div className="mt-3 md:mt-0">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Search records..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading records...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No records found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchQuery 
                    ? `No records match your search query "${searchQuery}"`
                    : selectedPatient 
                      ? "This patient hasn't shared any records with you yet"
                      : "You don't have access to any patient records yet"
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      {!selectedPatient && (
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Patient
                        </th>
                      )}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
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
                    {searchResults.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{record.name}</div>
                        </td>
                        {!selectedPatient && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{record.patientName}</div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
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
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                          >
                            View
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
      </div>
    </div>
  );
} 