import axios from 'axios';
import { mockDataStore } from './mockDataStore'; 
import { mock } from 'node:test';

const BASE_URL = 'http://localhost:8080';
const USE_MOCKS = true;
const MOCK_DELAY = 500; // ms

// Types
interface Task {
    id: number;
    title: string;
    description: string;
    bounty: number;
    deadline: string;
    providerId: string;
    createdAt: string;
    category: string;
    skills: string[];
    attachments: string[];
    isCompleted: boolean;
    isCancelled: boolean;
}

interface UserProfile {
    walletAddress: string;
    username: string;
    bio?: string;
    resumeUrl?: string;
    role: 'TASK_PROVIDER' | 'FREELANCER';
    reputationScore: number;
    totalEarnings: number;
    totalSpent: number;
    createdAt: string;
}

// Task Functions
export const taskApi = {
    async createTask(task: Omit<Task, 'createdAt' | 'isCompleted' | 'isCancelled'>) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            const newTask = mockDataStore.addTask(task);
            return newTask;
        }
        const response = await axios.post(`${BASE_URL}/tasks`, task);
        return response.data;
    },

    async getTask(id: number) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return {
                id,
                title: `Task ${id}`,
                description: "This is a sample task description with details about what needs to be done.",
                bounty: 1.5,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                providerId: "0x" + "1".repeat(40),
                createdAt: new Date().toISOString(),
                category: "development",
                skills: ["React", "TypeScript", "Blockchain"],
                attachments: [],
                isCompleted: false,
                isCancelled: false
            };
        }
        const response = await axios.get(`${BASE_URL}/tasks/${id}`);
        return response.data;
    },

    async updateTask(id: number, task: Task) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return { ...task, id };
        }
        const response = await axios.put(`${BASE_URL}/tasks/${id}`, task);
        return response.data;
    },

    async deleteTask(id: number) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return true;
        }
        await axios.delete(`${BASE_URL}/tasks/${id}`);
    },

    async getAllTasks() {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return mockDataStore.getTasks();
        }
        const response = await axios.get(`${BASE_URL}/tasks`);
        return response.data;
    },

    async cancelTask(id: number) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return {
                id,
                isCancelled: true
            };
        }
        const response = await axios.post(`${BASE_URL}/tasks/${id}/cancel`);
        return response.data;
    },

    async completeTask(id: number) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return {
                id,
                isCompleted: true
            };
        }
        const response = await axios.post(`${BASE_URL}/tasks/${id}/complete`);
        return response.data;
    }
};

// User Profile Functions
export const userApi = {
    async createProfile(profile: Omit<UserProfile, 'createdAt'>) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return { ...profile, createdAt: new Date().toISOString() };
        }
        const response = await axios.post(`${BASE_URL}/users`, profile);
        return response.data;
    },

    async getProfile(walletAddress: string) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            // Return mock user profile
            return {
                walletAddress,
                username: "Demo User",
                bio: "This is a demo user profile for showcasing the Chainwork platform's features.",
                resumeUrl: "",
                role: 'TASK_PROVIDER',
                reputationScore: 4.8,
                totalEarnings: 0,
                totalSpent: 7.5,
                createdAt: "2023-10-15T10:30:00Z"
            };
        }
        const response = await axios.get(`${BASE_URL}/users/${walletAddress}`);
        return response.data;
    },

    async updateProfile(walletAddress: string, profile: UserProfile) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return profile;
        }
        const response = await axios.put(`${BASE_URL}/users/${walletAddress}`, profile);
        return response.data;
    },

    async deleteProfile(walletAddress: string) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return true;
        }
        await axios.delete(`${BASE_URL}/users/${walletAddress}`);
    },

    async getAllProfiles() {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            // Return array of mock profiles
            return [
                {
                    walletAddress: "0x" + "1".repeat(40),
                    username: "Task Creator",
                    bio: "I create projects that need talented freelancers.",
                    role: 'TASK_PROVIDER',
                    reputationScore: 4.8,
                    totalEarnings: 0,
                    totalSpent: 7.5,
                    createdAt: "2023-10-15T10:30:00Z"
                },
                {
                    walletAddress: "0x" + "2".repeat(40),
                    username: "Blockchain Developer",
                    bio: "Experienced smart contract developer specialized in Solidity.",
                    role: 'FREELANCER',
                    reputationScore: 4.9,
                    totalEarnings: 12.3,
                    totalSpent: 0,
                    createdAt: "2023-09-20T14:15:00Z"
                },
                {
                    walletAddress: "0x" + "3".repeat(40),
                    username: "UI/UX Designer",
                    bio: "Creating beautiful interfaces for web3 applications.",
                    role: 'FREELANCER',
                    reputationScore: 4.7,
                    totalEarnings: 8.5,
                    totalSpent: 0,
                    createdAt: "2023-08-05T09:45:00Z"
                }
            ];
        }
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data;
    },

    async updateReputation(walletAddress: string, delta: number) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return { walletAddress, reputationDelta: delta };
        }
        const response = await axios.post(
            `${BASE_URL}/users/${walletAddress}/reputation?delta=${delta}`
        );
        return response.data;
    },

    async addEarnings(walletAddress: string, earnings: number) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return { walletAddress, earnings };
        }
        const response = await axios.post(
            `${BASE_URL}/users/${walletAddress}/earnings?earnings=${earnings}`
        );
        return response.data;
    },

    async addSpent(walletAddress: string, spent: number) {
        if (USE_MOCKS) {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return { walletAddress, spent };
        }
        const response = await axios.post(
            `${BASE_URL}/users/${walletAddress}/spent?spent=${spent}`
        );
        return response.data;
    }
};