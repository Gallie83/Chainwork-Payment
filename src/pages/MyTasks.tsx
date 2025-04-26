
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getContract } from "@/lib/contract";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, DollarSign, AlertCircle } from "lucide-react";
import { formatDate, formatAmount } from "@/lib/contract";
import { taskApi } from "../lib/api";
import { format } from "path";
import { ethers } from "ethers";

interface Task {
  id: number;
  title: string;
  taskProvider: string;
  description: string;
  bounty: bigint;
  deadline: number;
  isCompleted: boolean;
  isCancelled: boolean;
  submissions: {
    freelancer: string;
    submissionLink: string;
    isApproved: boolean;
  }[];
}

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const USE_MOCKS = true;

  console.log("tasks", tasks);

  const loadTasks = async () => {
    try {
      setLoading(true);
      
      // Get current wallet address
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      const currentAccount = accounts[0];
      
      if (USE_MOCKS) {
        // Mock implementation
        const backendTasks = await taskApi.getAllTasks();
        // Filter for tasks created by the current user
        const myTasks = backendTasks.filter(task => 
          task.providerId === "DemoProviderId"
        );
        setTasks(myTasks);
      } else {
        // Non-demo blockchain implementation
        const contract = await getContract();
        const counter = await contract.getCounter();
        const taskPromises = [];
        const submissionPromises = [];
   
        for (let i = 1; i <= counter; i++) {
          taskPromises.push(contract.getTask(i));
          submissionPromises.push(contract.getSubmissions(i));
        }
   
        const tasksData = await Promise.all(taskPromises);
        const submissionsData = await Promise.all(submissionPromises);
   
        const formattedTasks = tasksData
          .map((task, index) => ({
            id: Number(task[0]),
            title: task[1],
            taskProvider: task[1],
            description: task[2],
            bounty: task[3],
            deadline: Number(task[7]),
            isCompleted: task[4],
            isCancelled: task[5],
            submissions: submissionsData[index] || []
          }))
          .filter(task => task.id > 0 && currentAccount.toLowerCase() === task.taskProvider.toLowerCase());
   
        // Combine smart contract tasks with backend tasks
        try {
          const backendTasks = await taskApi.getAllTasks();
          const combinedTasks = await Promise.all(
            formattedTasks.map(async (formattedTask) => {
              const backendTask = backendTasks.find((task) => task.id === formattedTask.id);
              if (backendTask) {
                const combinedTask = {
                  ...backendTask,
                  bounty: formattedTask.bounty,
                  deadline: formattedTask.deadline,
                  isCompleted: formattedTask.isCompleted,
                  isCancelled: formattedTask.isCancelled,
                  submissions: formattedTask.submissions
                }
                return combinedTask;
              } else {
                // If task is not found in backend, create it
                try {
                  const newTaskData = {
                    id: formattedTask.id,
                    title: formattedTask.description, // Blockchain description is title
                    description: formattedTask.description, // Use title as description initially
                    bounty: Number(formattedTask.bounty),
                    deadline: new Date(formattedTask.deadline * 1000).toISOString(), // Convert Unix timestamp to ISO
                    providerId: formattedTask.taskProvider,
                    category: "other",
                    skills: [],
                    attachments: []
                  };
   
                  const createdTask = await taskApi.createTask(newTaskData);
   
                  const combinedTask = {
                    ...createdTask,
                    bounty: formattedTask.bounty,
                    deadline: formattedTask.deadline,
                    isCompleted: formattedTask.isCompleted,
                    isCancelled: formattedTask.isCancelled,
                    submissions: formattedTask.submissions
                  };
                  return combinedTask;
                } catch (error) {
                  console.error("Failed to create task in backend", error);
                  return {
                    ...formattedTask,
                    title: formattedTask.description,
                    description: formattedTask.description,
                    category: "other",
                    skills: [],
                    attachments: []
                  };
                }
              }
            })
          );
          setTasks(combinedTasks);
        } catch (error) {
          console.error("Failed to get tasks from backend", error);
          setTasks(formattedTasks);
        }
      }
    } catch (error) {
      toast({
        title: "Failed to load tasks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
   };
   
   useEffect(() => {
    loadTasks();
   }, []);

  const handleApproveSubmission = async (taskId: number, freelancerAddress: string) => {
    try {
      const contract = await getContract();
      const tx = await contract.approveSubmission(taskId, [freelancerAddress]);
      await tx.wait();
      
      toast({
        title: "Submission approved",
        description: "The bounty has been transferred to the freelancer",
      });
      
      loadTasks();
    } catch (error) {
      toast({
        title: "Failed to approve submission",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancelTask = async (taskId: number) => {
    try {
      const contract = await getContract();
      const tx = await contract.cancelTask(taskId);
      await tx.wait();
      
      toast({
        title: "Task cancelled",
        description: "The task has been cancelled and the bounty refunded",
      });
      
      loadTasks();
    } catch (error) {
      toast({
        title: "Failed to cancel task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="space-y-6">
          {tasks
            .filter(task => !task.isCompleted && !task.isCancelled)
            .map(task => (
              <TaskCard 
                key={task.id} 
                task={task}
                onApprove={handleApproveSubmission}
                onCancel={handleCancelTask}
              />
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {tasks
            .filter(task => task.isCompleted)
            .map(task => (
              <TaskCard 
                key={task.id} 
                task={task}
                onApprove={handleApproveSubmission}
                onCancel={handleCancelTask}
              />
            ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6">
          {tasks
            .filter(task => task.isCancelled)
            .map(task => (
              <TaskCard 
                key={task.id} 
                task={task}
                onApprove={handleApproveSubmission}
                onCancel={handleCancelTask}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TaskCard = ({ 
  task, 
  onApprove, 
  onCancel 
}: { 
  task: Task; 
  onApprove: (taskId: number, freelancer: string) => Promise<void>;
  onCancel: (taskId: number) => Promise<void>;
}) => {
  const isExpired = Date.now() > task.deadline * 1000;

  // Format the bounty value
  const displayBounty = (bounty: number | bigint | string): string => {
    try {
      // If it's already a number, just format it
      if (typeof bounty === 'number') {
        return bounty.toFixed(2);
      }
      
      // If it's a BigInt or string representation
      return ethers.formatEther(bounty.toString());
    } catch (error) {
      console.error("Error formatting bounty:", error);
      // Fallback to just returning the value as is
      return bounty.toString();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">{task.description}</CardDescription>
          </div>
          <Badge variant={task.isCompleted ? "default" : task.isCancelled ? "destructive" : "secondary"}>
            {task.isCompleted ? "Completed" : task.isCancelled ? "Cancelled" : isExpired ? "Expired" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>{displayBounty(task.bounty)} ETN</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{formatDate(task.deadline)}</span>
            </div>
          </div>

          {task.submissions?.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-medium">Submissions ({task.submissions?.length})</h4>
              {task.submissions?.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{submission.freelancer.slice(0, 6)}...{submission.freelancer.slice(-4)}</p>
                    <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      View Submission
                    </a>
                  </div>
                  {!task.isCompleted && !task.isCancelled && (
                    <Button onClick={() => onApprove(task.id, submission.freelancer)}>
                      Approve
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>No submissions yet</span>
            </div>
          )}

          {!task.isCompleted && !task.isCancelled && task.submissions?.length === 0 && (
            <Button 
              variant="destructive" 
              onClick={() => onCancel(task.id)}
              className="w-full"
            >
              Cancel Task
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyTasks;
