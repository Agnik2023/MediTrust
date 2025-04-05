// Sample deployment script for MediTrust contract
// Note: This is a demo script and would need to be adapted for a real deployment

const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const MediTrustFactory = await ethers.getContractFactory("MediTrust");
  
  console.log("Deploying MediTrust contract...");
  
  // Deploy the contract
  const mediTrust = await MediTrustFactory.deploy();
  await mediTrust.deployed();
  
  console.log("MediTrust contract deployed to:", mediTrust.address);
  
  // Add some demo records for testing if in demo mode
  if (process.env.DEMO_MODE === 'true') {
    console.log("Adding demo records...");
    
    // Demo IPFS hashes (these would normally be actual IPFS hashes)
    const ipfsHash1 = "QmT1JGgfkgYg8a2hQrjGzT7kgj8Ny8Qg5KJkx6j5j9jQx8";
    const ipfsHash2 = "QmT2JGgfkgYg8a2hQrjGzT7kgj8Ny8Qg5KJkx6j5j9jQx9";
    const ipfsHash3 = "QmT3JGgfkgYg8a2hQrjGzT7kgj8Ny8Qg5KJkx6j5j9jQx0";
    
    // Add records
    await mediTrust.addRecord(ipfsHash1, "Lab Results", 1024 * 1024 * 2); // 2MB
    console.log("Added record 1");
    
    await mediTrust.addRecord(ipfsHash2, "X-Ray", 1024 * 1024 * 5); // 5MB
    console.log("Added record 2");
    
    await mediTrust.addRecord(ipfsHash3, "Medical History", 1024 * 1024 * 1); // 1MB
    console.log("Added record 3");
    
    // Grant access to a doctor address for demo
    const doctorAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Demo doctor address
    await mediTrust.grantAccess(1, doctorAddress);
    console.log("Granted access to doctor for record 1");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 