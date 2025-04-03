import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to Taskify</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-semibold">Create a Task</h2>
            </Card.Header>
            <Card.Content>
              <p className="mb-4">Post a new task and find talented people to help you.</p>
              <Button onClick={() => navigate('/create-task')}>Create Task</Button>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-2xl font-semibold">Browse Tasks</h2>
            </Card.Header>
            <Card.Content>
              <p className="mb-4">Find tasks that match your skills and start earning.</p>
              <Button onClick={() => navigate('/tasks')} variant="secondary">View Tasks</Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}