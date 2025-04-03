
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getContract } from "@/lib/contract";
import { formatAmount } from "@/lib/contract";
import { TaskCard } from "@/components/TaskCard";
import { taskApi } from "@/lib/api";
import { ethers } from "ethers";

interface Task {
  id: number;
  title: string;
  description: string;
  bounty: number;
  deadline: string;
  providerId: string;
  category: string;
  skills: string[];
  isCompleted: boolean;
  isCancelled: boolean;
  selectedFreelancers: string[];
}

const Profile = () => {
  const [address, setAddress] = useState<string>("");
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [completedSubmissions, setCompletedSubmissions] = useState<Task[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [tasksPosted, setTasksPosted] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          await loadTasks(accounts[0]);
        }
      }
    };

    loadProfile();
  }, []);

  const loadTasks = async (userAddress: string) => {
    try {
      const contract = await getContract();
      const counter = await contract.getCounter();
      const taskPromises = [];

      for (let i = 1; i <= counter; i++) {
        taskPromises.push(taskApi.getTask(i));
      }

      const tasksData = await Promise.all(taskPromises);
      const posted = tasksData.filter(
        task => task.providerId.toLowerCase() === userAddress.toLowerCase()
      );
      setPostedTasks(posted);
      setTasksPosted(posted.length);

      const completed = tasksData.filter(
        task => task.selectedFreelancers.some(
          freelancer => freelancer.toLowerCase() === userAddress.toLowerCase()
        )
      );
      setCompletedSubmissions(completed);

      const earnings = completed.reduce(
        (acc, task) => acc + (task.bounty / task.selectedFreelancers.length),
        0
      );
      setTotalEarnings(earnings);

      const successRateCalc = posted.length > 0 
        ? (posted.filter(task => task.isCompleted).length / posted.length) * 100
        : 0;
      setSuccessRate(successRateCalc);

    } catch (error) {
      console.error("Failed to load profile data:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect your wallet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
                <p className="text-2xl font-bold">{formatAmount(BigInt(totalEarnings))} ETN</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Tasks Posted</h3>
                <p className="text-2xl font-bold">{tasksPosted}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
                <p className="text-2xl font-bold">{successRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posted" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posted">Posted Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Work</TabsTrigger>
          </TabsList>

          <TabsContent value="posted" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  bounty={task.bounty}
                  deadline={task.deadline}
                  category={task.category}
                  skills={task.skills}
                  isCompleted={task.isCompleted}
                  isCancelled={task.isCancelled}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedSubmissions.map(task => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  bounty={task.bounty}
                  deadline={task.deadline}
                  category={task.category}
                  skills={task.skills}
                  isCompleted={task.isCompleted}
                  isCancelled={task.isCancelled}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
