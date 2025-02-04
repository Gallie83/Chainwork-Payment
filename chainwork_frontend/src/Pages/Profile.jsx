import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Mail, Calendar } from 'lucide-react';

export function Profile() {
  const submissions = [
    {
      id: 1,
      task: 'Create a logo',
      type: 'Logo design',
      status: 'In progress',
    },
    {
      id: 2,
      task: 'Design a website layout',
      type: 'Web design',
      status: 'Submitted',
    },
    {
      id: 3,
      task: 'Write a product description',
      type: 'Product copy',
      status: 'Completed',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Card>
              <Card.Content>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={64} className="text-gray-400" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">John Doe</h2>
                  <p className="text-gray-600">@johndoe</p>
                  <Button className="mt-4 w-full">Edit Profile</Button>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail size={20} className="mr-2" />
                    john@example.com
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={20} className="mr-2" />
                    Joined March 2024
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold">Active Submissions</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{submission.task}</h3>
                        <p className="text-sm text-gray-600">{submission.type}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          submission.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : submission.status === 'In progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {submission.status}
                        </span>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}