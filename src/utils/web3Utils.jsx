import { ethers } from 'ethers';

export const setupETNNetwork = async () => {
  try {
    const ETN_CHAIN_ID = '0xcb2e';
    
    // First check if already on ETN network
    const currentChainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });
    
    console.log('Current chain ID:', currentChainId);
    console.log('Target ETN chain ID:', ETN_CHAIN_ID);

    if (currentChainId.toLowerCase() === ETN_CHAIN_ID.toLowerCase()) {
      console.log('Already on ETN network');
      return;
    }

    try {
      console.log('Attempting to switch to ETN network...');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ETN_CHAIN_ID }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        console.log('Network not found, attempting to add...');
        
        // Wait a brief moment before adding network
        await new Promise(resolve => setTimeout(resolve, 1000));

        const addNetworkParams = {
          chainId: ETN_CHAIN_ID,
          chainName: 'Electroneum Smart Chain Mainnet',
          nativeCurrency: {
            name: 'Electroneum',
            symbol: 'ETN',
            decimals: 18
          },
          rpcUrls: ['https://rpc.electroneum.com'],
          blockExplorerUrls: ['https://blockexplorer.electroneum.com']
        };

        console.log('Adding network with params:', addNetworkParams);

        // Try to add the network
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [addNetworkParams]
        });
      } else {
        console.error('Switch network error:', switchError);
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
      // Task creation is failing here
      const errorData = await response.json();
      console.error('Backend error details:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
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