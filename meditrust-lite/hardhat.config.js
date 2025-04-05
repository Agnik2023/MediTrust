require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
let privateKey;

try {
  privateKey = fs.readFileSync(".secret").toString().trim();
} catch (error) {
  privateKey = "0x" + "1".repeat(64); // Placeholder private key for development
}

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [privateKey]
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [privateKey],
      gasPrice: 8000000000
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      accounts: [privateKey],
      gasPrice: 30000000000
    }
  },
  paths: {
    sources: "./src/app/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./src/app/artifacts"
  }
}; 