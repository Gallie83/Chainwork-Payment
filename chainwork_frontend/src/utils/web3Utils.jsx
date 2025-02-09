import { ethers } from 'ethers';

export const setupETNNetwork = async () => {
  try {

    const ETN_CHAIN_ID = '0xCB3E'; // 52014 in hex
    console.log('Attempting to add/switch to chain ID:', ETN_CHAIN_ID);

    // Try to switch to ETN network first
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ETN_CHAIN_ID }],
      });
    } catch (switchError) {
      console.log("SWITCH ERROR:", switchError);

      // Network hasn't been added yet
      if (switchError.code === 4902) {
        console.log("Network not found, attempting to add...");
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: ETN_CHAIN_ID,
            chainName: 'Electroneum Smart Chain Mainnet',
            nativeCurrency: {
              name: 'Electroneum',
              symbol: 'ETN',
              decimals: 18
            },
            rpcUrls: ['https://rpc.electroneum.com'],
            blockExplorerUrls: ['https://blockexplorer.electroneum.com']
          }]
        });
      } else {
        throw switchError;
      }
    }
} catch (error) {
  console.error('Error setting up ETN network:', error);
  throw error;
}
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to use this feature');
    }

    // Ensure ETN network connection
    await setupETNNetwork();

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const createEscrowPayment = async (fromAddress, taskDetails, weiAmount) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // First, create task on backend
    const response = await fetch('/api/chainwork/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...taskDetails,
        bounty: weiAmount.toString(),
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

// Helper function to format ETN amounts
export const weiToETN = (amount) => {
  return ethers.utils.formatEther(amount);
};

// Helper function to parse ETN amounts
export const ETNToWei = (amount) => {
  return ethers.utils.parseEther(amount);
};