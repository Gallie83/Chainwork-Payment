import React, { useState } from "react";
import { Card } from "../components/UI/Card"; 
import { Button } from "../components/UI/Button"; 

export function CreateTask() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    amount: "",
    currency: "",
    deadline: { month: "", day: "", year: "" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create a Task</h1>
          <div className="mt-4 relative">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded">
              <div className="h-full w-1/4 bg-blue-600 rounded" />
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Step 1 of 4</div>
          </div>
        </div>

        
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <form className="space-y-6">
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title*
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Write a clear and descriptive title"
              />
            </div>

            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white min-h-[150px]"
                placeholder="Describe the task in detail..."
              />
            </div>

            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category*
              </label>
              <input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

           
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bounty</h3>
              <div className="space-y-4">
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount*
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
                    placeholder="$1000"
                  />
                </div>
               
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency*
                  </label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

           
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deadline</h3>
              <div className="grid grid-cols-3 gap-4">
               
                <div>
                  <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Month*
                  </label>
                  <select
                    id="month"
                    value={formData.deadline.month}
                    onChange={(e) => setFormData({ ...formData, deadline: { ...formData.deadline, month: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i).toLocaleString("default", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="day" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Day*
                  </label>
                  <select
                    id="day"
                    value={formData.deadline.day}
                    onChange={(e) => setFormData({ ...formData, deadline: { ...formData.deadline, day: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

           
            <div className="flex justify-between pt-4">
              <Button variant="secondary">Cancel</Button>
              <Button>Next</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
