import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, createEscrowPayment } from '../utils/web3Utils';

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
    const [isEtnNetwork, setIsEtnNetwork] = useState(null);

    useEffect(() => {
      const checkConnection = async () => {
        if(window.ethereum) {
          try {
            const accounts = await window.ethereum.request({
              method: 'eth_accounts'
            });
            if(accounts.length > 0) {
              setAccount(accounts[0]);
              const chainId = await window.ethereum.request({
                method: 'eth_chainId'
              });
              setIsEtnNetwork(chainId === '0xcb2e');
            }
          } catch(error) {
            console.error('Error checking connection:', error);
          }
        }
      }
  
      checkConnection();
    }, [])
     
    useEffect(() => {
      // Ensure connection is to ETN network
      const checkNetwork = async () => {
        if(window.ethereum) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId'});
          setIsEtnNetwork(chainId === '0xCB3E');
        }
      }

      // Listeners for account/network changes
      if(window.ethereum) {
        window.ethereum.on('chainChanged:', checkNetwork);
        window.ethereum.on('accountsChanged:', handleAccountChange);
        if(account) checkNetwork();
      }

      // Clean up listeners for when component unmounts
      return () => {
        if(window.ethereum) {
          window.ethereum.removeListener('chainChanged', checkNetwork);
          window.ethereum.removeListener('accountChanged', handleAccountChange);
        }
      }
    }, [account]);
  
    // Handle when account switch in MetaMask
    const handleAccountChange = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };
  
    // Initial wallet connection
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
      setAccount,
      loading,
      error,
      isEtnNetwork,
      setIsEtnNetwork,
      connectWallet: handleConnect,
      createTaskWithPayment
    };
  
    return (
      <PaymentContext.Provider value={value}>
        {children}
      </PaymentContext.Provider>
    );
  };