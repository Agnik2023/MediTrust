// This script will set up the necessary blockchain dependencies

const fs = require('fs');
const { execSync } = require('child_process');

// Function to execute shell commands
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing ${command}:`, error);
    process.exit(1);
  }
}

// Function to check if package is already installed
function isPackageInstalled(packageName) {
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    return (
      (packageJson.dependencies && packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[packageName])
    );
  } catch (error) {
    console.error('Error reading package.json:', error);
    return false;
  }
}

// Install dependencies
console.log('Installing blockchain and Web3 dependencies...');

// Regular dependencies
const dependencies = [
  'ethers@^6.8.0',
  'web3@^4.1.2',
  'web3modal@^1.9.12',
  '@metamask/sdk-react@^0.12.1',
  'ipfs-http-client@^60.0.0',
  'crypto-js@^4.1.1'
];

// Dev dependencies
const devDependencies = [
  'hardhat@^2.18.1',
  '@nomiclabs/hardhat-ethers@^2.2.3',
  '@nomiclabs/hardhat-waffle@^2.0.6',
  'ethereum-waffle@^4.0.10',
  'chai@^4.3.10'
];

// Install regular dependencies if not already installed
dependencies.forEach(dep => {
  const packageName = dep.split('@')[0];
  if (!isPackageInstalled(packageName)) {
    runCommand(`npm install ${dep}`);
  } else {
    console.log(`${packageName} already installed, skipping.`);
  }
});

// Install dev dependencies if not already installed
devDependencies.forEach(dep => {
  const packageName = dep.split('@')[0];
  if (!isPackageInstalled(packageName)) {
    runCommand(`npm install --save-dev ${dep}`);
  } else {
    console.log(`${packageName} already installed, skipping.`);
  }
});

// Initialize Hardhat if hardhat.config.js doesn't exist
if (!fs.existsSync('./hardhat.config.js')) {
  console.log('Initializing Hardhat...');
  runCommand('npx hardhat');
} else {
  console.log('Hardhat already initialized.');
}

// Create contracts directory if it doesn't exist
if (!fs.existsSync('./src/app/contracts')) {
  console.log('Creating contracts directory...');
  fs.mkdirSync('./src/app/contracts', { recursive: true });
}

// Copy the MediTrust.sol contract to contracts directory if it doesn't exist
if (!fs.existsSync('./src/app/contracts/MediTrust.sol')) {
  console.log('Using existing MediTrust.sol contract.');
} else {
  console.log('MediTrust.sol contract already exists.');
}

console.log('\nSetup complete! Use the following commands:');
console.log('- npm run dev: Start the Next.js development server');
console.log('- npx hardhat compile: Compile the smart contracts');
console.log('- npx hardhat run src/app/contracts/deploy.js: Deploy the smart contracts');

console.log('\nFor a complete demo without MetaMask:');
console.log('1. Connect wallet using the connect button');
console.log('2. Select a role (patient or doctor)');
console.log('3. Explore the dashboard and features');

console.log('\nHappy hacking!'); 