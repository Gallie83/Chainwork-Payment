import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePayment } from '../Context/PaymentContext';
import { ethers } from 'ethers';

export function CreateTask() {

  const [submitting, setSubmitting] = useState(false);
  
  const { 
    account, 
    loading, 
    error, 
    isEtnNetwork, 
    connectWallet, 
    createTaskWithPayment
  } = usePayment();

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      // 1. Check wallet connection
      if (!account) {
        await connectWallet();
        // Exit function after conneting wallet
        return; 
      }
      // Check network
      if(!isEtnNetwork) {
        throw new Error('Please switch to Electroneum network on MetaMask')
      }

      setSubmitting(true);

      // 2. Get form values
      const description = e.target.elements.description.value;
      const amount = e.target.elements.amount.value;
      const currency = e.target.elements.currency.value.toLowerCase();
      const deadline = e.target.elements.deadline.value;

      console.log(description,amount,currency,deadline)

      // Get price of ETN in selected Currency from CoinGecko
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=electroneum&vs_currencies=${currency}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch ETN price');
      }

      const priceData = await response.json();
      const etnPrice = priceData.electroneum[currency];

      console.log("ETN:", {etnPrice})
      // Convert fiat to ETN
      const etnAmount = amount / etnPrice;
      const formattedEtnAmount = Number(etnAmount).toFixed(6);

      const weiAmount = ethers.parseEther(formattedEtnAmount);

      // Show confirmation window with ETN to wei price
      const confirmed = window.confirm(
        `This task will cost ${formattedEtnAmount} ETN (${amount} ${currency.toUpperCase()}). Continue?`
      )
      if(confirmed) {
        // Call to backend to create the task
        const taskDetails = {
          description,
          deadline,
          bounty: weiAmount.toString()
        };

        const txHash = await createTaskWithPayment(taskDetails, weiAmount);
        console.log('Transaction hash:', txHash);

        alert('Task created successfully!');

        e.target.reset;
      }

    } catch(error) {
      console.error('Error creating task:', error);
      alert(error.message)
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create a Task</h1>
          <div className="mt-4 relative">
            <div className="h-2 bg-gray-200 rounded">
              <div className="h-full w-1/4 bg-blue-600 rounded" />
            </div>
            <div className="mt-2 text-sm text-gray-600">Step 1 of 4</div>
          </div>
        </div>

        <Card>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a clear and descriptive title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  name='description'
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                  placeholder="Describe the task in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Bounty</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount*
                    </label>
                    <input
                      type="number"
                      name='amount'
                      min={1}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="$1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency*
                    </label>
                    <select name="currency" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select currency</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline*
                </label>
                <input 
                  type="date"
                  name="deadline"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().slice(0, 16)} // Prevents selecting past dates
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="secondary">Cancel</Button>
                <Button 
                  type="submit"
                  disabled={submitting || loading || (account && !isEtnNetwork)}>
                    {!account 
                      ? 'LinkMetaMask' 
                      : submitting 
                        ? 'Create Task...' 
                        : 'Create Task'
                    }
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}