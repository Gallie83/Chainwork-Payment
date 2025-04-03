import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';

export function Tasks() {
  const tasks = [
    {
      id: 1,
      title: 'Create a logo',
      description: 'Design a modern logo for a tech startup',
      bounty: '$1000',
      status: 'In progress',
    },
    {
      id: 2,
      title: 'Design a website layout',
      description: 'Create a responsive website design',
      bounty: '$2000',
      status: 'Open',
    },
    // Add more tasks as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Available Tasks</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <Card.Header>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{task.title}</h2>
                  <span className="text-lg font-medium text-green-600">{task.bounty}</span>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {task.status}
                  </span>
                  <Button>View Details</Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}