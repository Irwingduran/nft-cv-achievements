const { ethers } = require('ethers');
const fs = require('fs');

// Contract deployment script for Polygon Mumbai testnet
async function deployContract() {
  // Connect to Polygon Mumbai testnet
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
  
  // Replace with your private key (use environment variable in production)
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log('Deploying contract with account:', wallet.address);
  console.log('Account balance:', ethers.formatEther(await provider.getBalance(wallet.address)));
  
  // Contract bytecode and ABI (you'll need to compile the Solidity contract first)
  const contractFactory = new ethers.ContractFactory(
    CONTRACT_ABI, // You'll need to add the ABI here
    CONTRACT_BYTECODE, // You'll need to add the bytecode here
    wallet
  );
  
  // Deploy the contract
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();
  
  console.log('Contract deployed to:', await contract.getAddress());
  console.log('Transaction hash:', contract.deploymentTransaction().hash);
  
  // Save contract address to file
  const deploymentInfo = {
    address: await contract.getAddress(),
    transactionHash: contract.deploymentTransaction().hash,
    network: 'mumbai',
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync('contract-deployment.json', JSON.stringify(deploymentInfo, null, 2));
  console.log('Deployment info saved to contract-deployment.json');
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
