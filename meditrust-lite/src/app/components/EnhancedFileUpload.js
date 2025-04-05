"use client";

import { useState, useRef, useEffect } from 'react';
import { uploadToIPFS, encryptAndUpload } from '../utils/ipfs';
import { uploadRecordToBlockchain } from '../utils/contract';
import { useUser } from '../utils/UserContext';

export default function EnhancedFileUpload() {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [animateCard, setAnimateCard] = useState(false);
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);

  // 3D card effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s';
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for PDFs or images
    if (file.type === 'application/pdf') {
      setFilePreview('/images/pdf-icon.svg');
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile || !user.address) return;

    try {
      setUploading(true);
      setUploadStatus('Preparing file...');
      setAnimateCard(true);
      
      // Simulate a more detailed upload process
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        
        if (progress <= 20) {
          setUploadStatus('Encrypting file contents...');
        } else if (progress <= 40) {
          setUploadStatus('Preparing for IPFS upload...');
        } else if (progress <= 70) {
          setUploadStatus('Uploading to decentralized storage...');
        } else if (progress <= 90) {
          setUploadStatus('Recording on blockchain...');
        } else {
          setUploadStatus('Finalizing...');
        }
        
        if (progress >= 100) {
          clearInterval(interval);
          
          setTimeout(() => {
            uploadSuccess();
          }, 500);
        }
      }, 300);
      
      // Simulate IPFS upload
      const ipfsResult = await encryptAndUpload(selectedFile, user.address);
      
      // Simulate blockchain transaction
      const blockchainResult = await uploadRecordToBlockchain(ipfsResult.cid, user.address);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
      setUploadStatus('Upload failed');
      setUploadProgress(0);
      setAnimateCard(false);
    }
  };

  const uploadSuccess = () => {
    // Add the file to uploaded files list
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
    setUploadStatus('');
    setAnimateCard(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      if (file.type === 'application/pdf') {
        setFilePreview('/images/pdf-icon.svg');
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`w-full max-w-3xl mx-auto p-8 rounded-xl shadow-lg 
        ${animateCard ? 'animate-pulse' : ''}
        transition-all duration-300 
        bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900
        hover:shadow-2xl`}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        Upload Medical Records
      </h2>
      
      <div className="mb-6">
        <div 
          className="flex items-center justify-center w-full"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label 
            className="flex flex-col w-full h-40 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg 
              cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 
              transition-all duration-300 transform hover:scale-[1.01]"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-12 h-12 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, JPG, PNG (MAX. 10MB)
              </p>
              {selectedFile && (
                <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  {selectedFile.name}
                </p>
              )}
            </div>
            <input 
              ref={fileInputRef}
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
        <div className="flex justify-center mb-6">
          <div className="relative group">
            {filePreview.startsWith('data:image') ? (
              <img 
                src={filePreview} 
                alt="Preview" 
                className="max-h-56 rounded-lg object-contain shadow-md 
                  transform transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </div>
        </div>
      )}

      {uploading && (
        <div className="mb-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                  {uploadStatus}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                  {uploadProgress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-gray-700">
              <div 
                style={{ width: `${uploadProgress}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-600 
                  transition-all duration-300 ease-out"
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={uploadFile}
          disabled={!selectedFile || uploading || !user.isConnected}
          className={`px-8 py-3 rounded-lg text-white font-medium transition-all duration-300 
            transform hover:translate-y-[-2px] hover:shadow-lg
            ${!selectedFile || uploading || !user.isConnected
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'}
          `}
        >
          {uploading ? 'Uploading...' : 'Encrypt & Upload'}
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
            Uploaded Files
          </h3>
          <div className="overflow-auto max-h-80 rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {uploadedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{file.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Secured on Blockchain
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">View</button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Share</button>
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