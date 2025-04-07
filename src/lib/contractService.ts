
import { getContract, switchToElectroneum } from './contract';
import { ethers } from 'ethers';

const USE_MOCKS = true;

export class ContractService {
  static async createTask(title: string, deadline: number, bountyAmount: string) {
    // Simulate transaction for demo purposes
    if(USE_MOCKS) {
      await switchToElectroneum();
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return {
        hash: "0x" + Math.random().toString(16).substring(2) + "0".repeat(40),
        wait: async () => ({ status: 1 })
      };
    }

    const contract = await getContract();
    const bountyInWei = ethers.parseEther(bountyAmount);
    const tx = await contract.createTask(title, deadline, {
      value: bountyInWei,
    });
    return await tx.wait();
  }

  static async getAllTasks() {
    if (USE_MOCKS) {
      // Mock tasks
      // Simulate network delat
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [
        {
          id: 1,
          taskProvider: "0x" + "1".repeat(40),
          description: "Sample task 1",
          bounty: ethers.parseEther("1.5"),
          isCompleted: false,
          isCancelled: false,
          selectedFreelancers: [],
          deadline: Math.floor(Date.now() / 1000) + 86400 * 7
        },
        {
          id: 2,
          taskProvider: "0x" + "1".repeat(40),
          description: "Sample task 2",
          bounty: ethers.parseEther("2.25"),
          isCompleted: false,
          isCancelled: false,
          selectedFreelancers: [],
          deadline: Math.floor(Date.now() / 1000) + 86400 * 3
        }
      ];
    }

    const contract = await getContract();
    const counter = await contract.getCounter();
    const taskPromises = [];

    for (let i = 1; i <= counter; i++) {
      taskPromises.push(contract.getTask(i));
    }

    return await Promise.all(taskPromises);
  }

  static async getTask(id: number) {

    if (USE_MOCKS) {
      return {
        id: id,
        taskProvider: "0x" + "1".repeat(40),
        description: "Sample task " + id,
        bounty: ethers.parseEther("1.5"),
        isCompleted: false,
        isCancelled: false,
        selectedFreelancers: [],
        deadline: Math.floor(Date.now() / 1000) + 86400 * 7
      };
    }

    const contract = await getContract();
    return await contract.getTask(id);
  }

  static async getCounter() {
    if(USE_MOCKS) {
      // Mock value
      return 2; 
    }
    const contract = await getContract();
    return await contract.getCounter();
  }

  static async getSubmissions(taskId: number) {
    if(USE_MOCKS) {
      return []
    }
    const contract = await getContract();
    return await contract.getSubmissions(taskId);
  }

  static async submitWork(taskId: number, submissionLink: string) {
    if (USE_MOCKS) {
      await switchToElectroneum();
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        hash: "0x" + Math.random().toString(16).substring(2) + "0".repeat(40),
        wait: async () => ({ status: 1 })
      };
    }

    const contract = await getContract();
    const tx = await contract.submitWork(taskId, submissionLink);
    return tx;
  }

  static async approveSubmission(taskId: number, freelancerAddress: string) {

    if (USE_MOCKS) {
      await switchToElectroneum();
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        hash: "0x" + Math.random().toString(16).substring(2) + "0".repeat(40),
        wait: async () => ({ status: 1 })
      };
    }

    const contract = await getContract();
    const tx = await contract.approveSubmission(taskId, [freelancerAddress]);
    return await tx.wait();
  }

  static async cancelTask(taskId: number) {

    if (USE_MOCKS) {
      await switchToElectroneum();
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        hash: "0x" + Math.random().toString(16).substring(2) + "0".repeat(40),
        wait: async () => ({ status: 1 })
      };
    }

    const contract = await getContract();
    const tx = await contract.cancelTask(taskId);
    return await tx.wait();
  }
}
