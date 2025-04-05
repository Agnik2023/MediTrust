"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../utils/UserContext';

export default function SelectRole() {
  const { user, setUserType } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    
    // Set user type in context and localStorage
    setUserType(selectedRole);
    
    // Redirect to appropriate dashboard based on role
    setTimeout(() => {
      setIsSubmitting(false);
      if (selectedRole === 'patient') {
        router.push('/dashboard');
      } else {
        router.push('/doctor-dashboard');
      }
    }, 1000);
  };

  // If not connected, show placeholder with quick connect option
  if (!user.isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            You need to connect your MetaMask wallet to select your role.
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
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Select Your Role
        </h1>
        <p className="mt-3 max-w-md mx-auto text-lg text-gray-600 dark:text-gray-300">
          Choose how you'll use MediTrust based on your role
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl w-full">
          {/* Patient Role Card */}
          <div 
            className={`border-2 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg
              ${selectedRole === 'patient' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 scale-105' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'}`}
            onClick={() => handleRoleSelect('patient')}
          >
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${selectedRole === 'patient' ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <svg className={`h-10 w-10 ${selectedRole === 'patient' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">Patient</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">Upload medical records</p>
                </div>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">Control who can access your records</p>
                </div>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">View and manage your medical data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Role Card */}
          <div 
            className={`border-2 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg
              ${selectedRole === 'doctor' 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-20 scale-105' 
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'}`}
            onClick={() => handleRoleSelect('doctor')}
          >
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${selectedRole === 'doctor' ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <svg className={`h-10 w-10 ${selectedRole === 'doctor' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">Healthcare Provider</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">Access shared patient records</p>
                </div>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">Review medical history securely</p>
                </div>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-gray-600 dark:text-gray-300">Maintain patient confidentiality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || isSubmitting}
            className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white
              ${!selectedRole 
                ? 'bg-gray-400 cursor-not-allowed' 
                : selectedRole === 'patient' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'}
              transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedRole === 'patient' ? 'focus:ring-blue-500' : 'focus:ring-indigo-500'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Continue as {selectedRole ? (selectedRole === 'patient' ? 'Patient' : 'Healthcare Provider') : 'Selected Role'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 