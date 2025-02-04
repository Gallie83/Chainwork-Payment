import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Star } from 'lucide-react';

export function ReviewSubmission() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Review Submission</h1>
            <p className="text-gray-600">Submission #1</p>
          </div>
          <Button variant="outline">View Profile</Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="mb-8">
              <Card.Header>
                <h2 className="text-2xl font-semibold">Rating</h2>
              </Card.Header>
              <Card.Content>
                <div className="flex space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="text-gray-400 hover:text-yellow-400"
                    >
                      <Star size={24} />
                    </button>
                  ))}
                </div>
                <Button>Submit Rating</Button>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold">Feedback</h2>
              </Card.Header>
              <Card.Content>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                  placeholder="Provide detailed feedback..."
                />
              </Card.Content>
            </Card>
          </div>

          <div>
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Submission Details</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1">Under Review</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Submitted By</h3>
                    <p className="mt-1">@username</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Submitted On</h3>
                    <p className="mt-1">March 15, 2024</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}