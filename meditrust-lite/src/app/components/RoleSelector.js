"use client";

import { useState } from 'react';
import { useUser } from '../utils/UserContext';
import { useRouter } from 'next/navigation';

export default function RoleSelector() {
  const { user, setUserType } = useUser();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    
    // Set the user role in context
    setUserType(selectedRole);
    
    // Redirect to appropriate dashboard
    setTimeout(() => {
      if (selectedRole === 'patient') {
        router.push('/dashboard');
      } else {
        router.push('/doctor-dashboard');
      }
      setIsSubmitting(false);
    }, 1500);
  };

  if (!user.isConnected) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Connect Your Wallet</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Please connect your wallet to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select Your Role</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Choose how you'll be using MediTrust
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Patient Role Card */}
        <div 
          onClick={() => handleRoleSelect('patient')}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
            ${selectedRole === 'patient' 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
          `}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Patient</h3>
          </div>
          
          <ul className="space-y-2 mb-4 text-gray-600 dark:text-gray-300">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Upload your medical records
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Control who can access your data
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Manage your health history
            </li>
          </ul>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For individuals who want to store and share their medical records securely.
          </p>
        </div>
        
        {/* Doctor Role Card */}
        <div 
          onClick={() => handleRoleSelect('doctor')}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
            ${selectedRole === 'doctor' 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'}
          `}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Healthcare Provider</h3>
          </div>
          
          <ul className="space-y-2 mb-4 text-gray-600 dark:text-gray-300">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Access patient records with permission
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              View complete medical history
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Maintain patient privacy and security
            </li>
          </ul>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For doctors and healthcare providers who need access to patient records.
          </p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
          className={`px-8 py-3 rounded-lg text-white font-medium transition-all duration-300 
            ${!selectedRole || isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : selectedRole === 'patient' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-green-600 hover:bg-green-700'}
          `}
        >
          {isSubmitting ? 'Setting up your account...' : 'Continue'}
        </button>
      </div>
    </div>
  );
} 