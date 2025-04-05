"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for PDFs or images
    if (file.type === 'application/pdf') {
      setFilePreview('/images/pdf-icon.svg'); // Updated to SVG
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simulate a successful upload
          setTimeout(() => {
            const newFile = {
              id: Date.now(),
              name: selectedFile.name,
              size: selectedFile.size,
              type: selectedFile.type,
              uploadedAt: new Date().toISOString(),
              cid: 'ipfs://' + Math.random().toString(36).substring(2, 15)
            };
            
            setUploadedFiles(prev => [...prev, newFile]);
            setSelectedFile(null);
            setFilePreview(null);
            setUploadProgress(0);
            setUploading(false);
          }, 500);
        }
      }, 300);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
        Upload Medical Records
      </h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedFile ? selectedFile.name : 'Drag and drop your files, or click to select'}
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileChange} 
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {filePreview && (
        <div className="flex justify-center mb-4">
          {filePreview.startsWith('data:image') ? (
            <img src={filePreview} alt="Preview" className="max-h-56 rounded" />
          ) : (
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          )}
        </div>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">
            {uploadProgress}% Uploaded
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={uploadFile}
          disabled={!selectedFile || uploading}
          className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
            !selectedFile || uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload to IPFS'}
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Uploaded Files</h3>
          <div className="overflow-auto max-h-64 rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {uploadedFiles.map((file) => (
                  <tr key={file.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{file.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Uploaded to IPFS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 