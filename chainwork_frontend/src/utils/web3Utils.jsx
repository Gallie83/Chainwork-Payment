import { ethers } from 'ethers';

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to use this feature');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const createEscrowPayment = async (fromAddress, taskDetails, bountyAmount) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Convert bounty amount to wei
    const bountyInWei = ethers.utils.parseEther(bountyAmount.toString());

    // First, create task on backend
    const response = await fetch('/api/chainwork/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...taskDetails,
        bounty: bountyInWei.toString(),
        fromAddress
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create task on backend');
    }

    const { contractAddress, data } = await response.json();

    // Send transaction to blockchain
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: bountyInWei,
      data: data
    });

    // Wait for transaction to be mined
    await tx.wait();

    return tx.hash;
  } catch (error) {
    console.error('Error creating escrow payment:', error);
    throw error;
  }
};

export const handleNetworkChange = () => {
  // Reload the page on network change as recommended by MetaMask
  window.location.reload();
};

// Helper function to format ETN amounts
export const formatETN = (amount) => {
  return ethers.utils.formatEther(amount);
};

// Helper function to parse ETN amounts
export const parseETN = (amount) => {
  return ethers.utils.parseEther(amount);
};