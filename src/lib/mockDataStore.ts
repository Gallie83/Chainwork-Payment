// This file contains mock data for demo purposes.

const mockTasks = [
    {
      id: 1,
      title: "Build a React Dashboard",
      description: "Create a responsive admin dashboard with charts and data visualization.",
      bounty: 2.5,
      deadline: Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60, // 10 days from now
      providerId: "DemoProviderId",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: "development",
      skills: ["React", "TypeScript", "Data Visualization"],
      attachments: [],
      isCompleted: false,
      isCancelled: false
    },
    {
      id: 2,
      title: "Smart Contract Audit",
      description: "Perform a comprehensive security audit on our smart contract.",
      bounty: 3.2,
      deadline: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60, // 15 days from now
      providerId: "DemoProviderId",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: "blockchain",
      skills: ["Solidity", "Security", "Auditing"],
      attachments: [],
      isCompleted: false,
      isCancelled: false
    }
  ];

  export const mockDataStore = {
    getTasks: () => [...mockTasks],

    addTask: (task) => {
        const newTask = {
            ...task,
            id: task.id || mockTasks.length + 1,
            createdAt: task.createdAt || new Date().toISOString(),
            isCompleted: false,
            isCancelled: false
        }

        mockTasks.push(newTask);
        return newTask;
    },

    getMyTasks: (providerId) => {
        return mockTasks.filter(task => task.providerId === providerId);
    },
  }