"use client";

import Hero from './components/Hero';
import Features from './components/Features';
import { redirect } from 'next/navigation';
import { useUser } from './utils/UserContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, login } = useUser();
  const router = useRouter();

  // Handle the "Get Started" button click
  const handleGetStarted = async () => {
    // If wallet is already connected, go to appropriate page
    if (user.isConnected) {
      if (user.userType === 'patient') {
        router.push('/dashboard');
        return;
      } else if (user.userType === 'doctor') {
        router.push('/doctor-dashboard');
        return;
      } else {
        router.push('/select-role');
        return;
      }
    }

    // If wallet is not connected, try connecting
    const connectButton = document.getElementById('connect-wallet-btn');
    if (connectButton) {
      connectButton.click();
    } else {
      // If button not found, connect directly
      try {
        const result = await login();
        if (result.success) {
          // Wait a moment for state to update
          setTimeout(() => {
            router.push('/select-role');
          }, 500);
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
    
    // Scroll to top to make connection dialog visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <Features />
      
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Simple, Secure, and Transparent
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              MediTrust combines blockchain technology with IPFS storage for maximum security and transparency
            </p>
          </div>

          <div className="relative">
            {/* Steps connected by vertical line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 dark:bg-blue-900"></div>
            
            <div className="space-y-24">
              {/* Step 1 */}
              <div className="relative">
                <div className="md:flex items-center justify-between">
                  <div className="md:w-5/12">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                      <div className="text-blue-600 dark:text-blue-400 text-4xl font-bold mb-4">01</div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Connect Wallet</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Sign in with your MetaMask wallet to securely authenticate yourself. Your wallet serves as your digital identity.
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-blue-500 dark:bg-blue-600 z-10">
                    <div className="flex h-full justify-center items-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="md:w-5/12"></div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="md:flex items-center justify-between">
                  <div className="md:w-5/12 md:order-last">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                      <div className="text-blue-600 dark:text-blue-400 text-4xl font-bold mb-4">02</div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Upload Records</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Upload your medical records through our secure interface. Files are encrypted before being stored on the decentralized IPFS network.
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-blue-500 dark:bg-blue-600 z-10">
                    <div className="flex h-full justify-center items-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="md:w-5/12"></div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="md:flex items-center justify-between">
                  <div className="md:w-5/12">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                      <div className="text-blue-600 dark:text-blue-400 text-4xl font-bold mb-4">03</div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Blockchain Verification</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Your record's metadata is stored on the blockchain, creating an immutable proof of existence and ownership of your medical data.
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-blue-500 dark:bg-blue-600 z-10">
                    <div className="flex h-full justify-center items-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="md:w-5/12"></div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative">
                <div className="md:flex items-center justify-between">
                  <div className="md:w-5/12 md:order-last">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                      <div className="text-blue-600 dark:text-blue-400 text-4xl font-bold mb-4">04</div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Controlled Access</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Grant and revoke access to healthcare providers as needed. Only approved doctors can view your records, ensuring your privacy.
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-blue-500 dark:bg-blue-600 z-10">
                    <div className="flex h-full justify-center items-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="md:w-5/12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Ready to take control of your medical data?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Join thousands of patients who are securely managing their medical records with MediTrust.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleGetStarted}
                className="relative overflow-hidden group px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition duration-300"
              >
                <span className="absolute right-full w-12 h-full transform translate-x-12 bg-white opacity-10 transform -skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-96"></span>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
