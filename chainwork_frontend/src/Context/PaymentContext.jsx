import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, handleNetworkChange } from '../utils/web3Utils';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      // Listen for account changes
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountChange);
        window.ethereum.on('chainChanged', handleNetworkChange);
      }
  
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountChange);
          window.ethereum.removeListener('chainChanged', handleNetworkChange);
        }
      };
    }, []);
  
    const handleAccountChange = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };
  
    const handleConnect = async () => {
      try {
        setLoading(true);

        if(!window.ethereum) {
          throw new Error("MetaMask not installed!")
        }

        const address = await connectWallet();

        setAccount(address);
        setError(null);

        return address;
      } catch (err) {
        setError(err.message);
        console.error(err)
      } finally {
        setLoading(false);
      }
    };
  
    const createTaskWithPayment = async (taskDetails, bountyAmount) => {
      try {
        setLoading(true);
        setError(null);
  
        if (!account) {
          throw new Error('Please connect your wallet first');
        }
  
        // Create escrow payment
        const txHash = await createEscrowPayment(account, taskDetails, bountyAmount);
  
        return txHash;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    const value = {
      account,
      loading,
      error,
      connectWallet: handleConnect,
      createTaskWithPayment
    };
  
    return (
      <PaymentContext.Provider value={value}>
        {children}
      </PaymentContext.Provider>
    );
  };