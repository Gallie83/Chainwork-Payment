import React, { useState } from "react";
import { Card } from "../components/UI/Card"; 
import { Button } from "../components/UI/Button"; 
import { Search } from "lucide-react";

export function Tasks() {
  const allTasks = [
    {
      id: 1,
      title: "Create a logo",
      description: "Design a modern logo for a tech startup",
      bounty: "$1000",
      status: "In progress",
    },
    {
      id: 2,
      title: "Design a website layout",
      description: "Create a responsive website design",
      bounty: "$2000",
      status: "Open",
    },
    {
      id: 3,
      title: "Develop a mobile app",
      description: "Build a cross-platform app using React Native",
      bounty: "$3000",
      status: "Completed",
    },
    {
      id: 4,
      title: "Write technical documentation",
      description: "Create detailed documentation for an API",
      bounty: "$500",
      status: "Open",
    },
    {
      id: 5,
      title: "Build a landing page",
      description: "Develop a high-converting landing page for a product",
      bounty: "$1500",
      status: "In progress",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = allTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800";
      case "In progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Available Tasks
          </h1>
          
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card key={task.id} className="bg-white dark:bg-gray-800 shadow-md">
                <Card.Header>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {task.title}
                    </h2>
                    <span className="text-lg font-medium text-green-600">{task.bounty}</span>
                  </div>
                </Card.Header>
                <Card.Content>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                    <Button>View Details</Button>
                  </div>
                </Card.Content>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
