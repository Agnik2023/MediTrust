"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../utils/UserContext';

export default function Upload() {
  const { user } = useUser();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [recordType, setRecordType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            alert('Record uploaded successfully!');
            router.push('/dashboard');
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    
    if (!recordType) {
      alert('Please select a record type');
      return;
    }
    
    simulateUpload();
  };

  // Record type options
  const recordTypes = [
    { value: 'lab-test', label: 'Lab Test Results' },
    { value: 'imaging', label: 'Imaging (X-Ray, MRI, etc.)' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'medical-history', label: 'Medical History' },
    { value: 'vaccination', label: 'Vaccination Record' },
    { value: 'insurance', label: 'Insurance Information' },
    { value: 'other', label: 'Other' },
  ];

  // If not connected, show placeholder with quick connect option
  if (!user.isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            You need to connect your MetaMask wallet to upload medical records.
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
            Upload Medical Record
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Upload and encrypt your medical records for secure storage on IPFS.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Upload Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Your file will be encrypted before being stored on IPFS.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File upload area */}
            <div className="space-y-2">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Medical Record File
              </label>
              
              <div 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors
                  ${dragActive ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900 dark:bg-opacity-20' : 'border-gray-300 dark:border-gray-600'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, JPG, PNG, DICOM up to 50MB
                  </p>
                  
                  {file && (
                    <div className="mt-2 text-sm text-gray-800 dark:text-gray-200 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <p className="font-medium truncate max-w-xs mx-auto">{file.name}</p>
                      <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Record type selection */}
            <div className="space-y-2">
              <label htmlFor="record-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Record Type
              </label>
              <select
                id="record-type"
                name="record-type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
              >
                <option value="" disabled>Select a record type</option>
                {recordTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Privacy notice */}
            <div className="rounded-md bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your files are encrypted client-side before being uploaded. Only you can grant access to others.
                  </p>
                </div>
              </div>
            </div>

            {isUploading ? (
              <div className="space-y-3">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                        Encrypting & Uploading
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-300">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-gray-700">
                    <div 
                      style={{ width: `${uploadProgress}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-400"
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Please wait while your file is being encrypted and uploaded to IPFS...
                </p>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Upload Record
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 