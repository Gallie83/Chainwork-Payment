import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getContract } from "@/lib/contract";
import { taskApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component
import { Clock, DollarSign, AlertCircle, Send, Edit, Check, X } from "lucide-react"; // Added icons
import { formatDate, formatAmount } from "@/lib/contract";
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
  attachments: string[];
  isCompleted: boolean;
  isCancelled: boolean;
  submissions?: {
    freelancer: string;
    submissionLink: string;
    isApproved: boolean;
  }[];
}

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [isProvider, setIsProvider] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Add state for edit mode and form fields
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const loadTask = async () => {
    try {
      if (!id) return;

      // Fetch complete task data from backend
      const taskData = await taskApi.getTask(Number(id));
      
      // Only fetch submissions from blockchain
      const contract = await getContract();
      const submissionsData = await contract.getSubmissions(BigInt(id));
      
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      const currentAccount = accounts[0];
      setUserAddress(currentAccount);
      setIsProvider(currentAccount.toLowerCase() === taskData.providerId.toLowerCase());

      const fullTask = {
        ...taskData,
        submissions: submissionsData
      };
      
      setTask(fullTask);
      // Initialize editedTask with current task values
      setEditedTask({
        title: fullTask.title,
        description: fullTask.description,
        bounty: fullTask.bounty,
        deadline: new Date(fullTask.deadline).toISOString().split('T')[0], // Format for date input
        category: fullTask.category,
        skills: fullTask.skills
      });
    } catch (error: any) {
      toast({
        title: "Failed to load task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink || !id) {
      toast({
        title: "Missing submission link",
        description: "Please provide a submission link",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const contract = await getContract();
      const taskId = BigInt(id);
      const tx = await contract.submitWork(taskId, submissionLink);
      await tx.wait();
      
      toast({
        title: "Work submitted successfully",
        description: "Your submission has been recorded",
      });
      
      setSubmissionLink("");
      loadTask();
    } catch (error: any) {
      toast({
        title: "Failed to submit work",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (freelancerAddress: string) => {
    if (!id) return;

    try {
      const contract = await getContract();
      const taskId = BigInt(id);
      const tx = await contract.approveSubmission(taskId, [freelancerAddress]);
      await tx.wait();

      // Update task status in backend
      // Convert id from string to number for backend API
      const numericId = parseInt(id);
      await taskApi.completeTask(numericId);
      
      toast({
        title: "Submission approved",
        description: "The bounty has been transferred to the freelancer",
      });
      
      loadTask();
    } catch (error: any) {
      toast({
        title: "Failed to approve submission",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    if (!id) return;

    try {
      // Cancel on blockchain
      const contract = await getContract();
      const taskId = BigInt(id);
      const tx = await contract.cancelTask(taskId);
      await tx.wait();

      // Update task status in backend
      // Convert id from string to number for backend API
      const numericId = parseInt(id);
      await taskApi.cancelTask(numericId);
      
      toast({
        title: "Task cancelled",
        description: "The task has been cancelled and the bounty refunded",
      });
      
      loadTask();
    } catch (error: any) {
      toast({
        title: "Failed to cancel task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handler for updating task fields
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !id) return;

    setIsUpdating(true);
    try {
      // Check if bounty was updated
      const bountyChanged = editedTask.bounty !== task.bounty;
      const numericId = parseInt(id);
      
      // Prepare task update object
      const updatedTask = {
        ...task,
        ...editedTask,
        // Ensure we don't send submissions to the backend
        submissions: undefined
      };

      // Update task details on blockchain if needed
      if (bountyChanged) {
        // If bounty changed, we might need to update the smart contract
        const contract = await getContract();
        const taskId = BigInt(id);
        
        // This assumes your smart contract has an updateTaskBounty function
        // You might need to adjust this based on your actual smart contract methods
        const tx = await contract.updateTaskBounty(taskId, ethers.parseEther(String(editedTask.bounty)));
        await tx.wait();
      }

      // Update task in backend
      await taskApi.updateTask(numericId, updatedTask as Task);
      
      toast({
        title: "Task updated successfully",
        description: "The task details have been updated",
      });
      
      setIsEditMode(false);
      loadTask();
    } catch (error: any) {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: name === 'bounty' ? parseFloat(value) : value
    }));
  };

  if (!task) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <AlertCircle className="w-6 h-6 mr-2" />
              Loading task details...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(task.deadline).getTime() < Date.now();
  const hasSubmitted = task.submissions?.some(
    s => s.freelancer.toLowerCase() === userAddress.toLowerCase()
  ) ?? false;
  
  // Only providers can edit tasks and only if the task is not completed or cancelled
  const canEdit = isProvider && !task.isCompleted && !task.isCancelled;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="w-full">
              {isEditMode ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={editedTask.title || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={editedTask.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <Label htmlFor="bounty">Bounty (ETN)</Label>
                      <Input
                        id="bounty"
                        name="bounty"
                        type="number"
                        step="0.01"
                        value={editedTask.bounty || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-1/2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={editedTask.deadline || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditMode(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleUpdateTask}
                      disabled={isUpdating}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <CardTitle>{task.title}</CardTitle>
                    {canEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditMode(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <CardDescription className="mt-2">{task.description}</CardDescription>
                </>
              )}
            </div>
            <Badge variant={task.isCompleted ? "default" : task.isCancelled ? "destructive" : "secondary"}>
              {task.isCompleted ? "Completed" : task.isCancelled ? "Cancelled" : isExpired ? "Expired" : "Active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>{formatAmount(task.bounty)} ETN</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{formatDate(task.deadline)}</span>
            </div>
          </div>

          {!task.isCompleted && !task.isCancelled && !isProvider && !hasSubmitted && (
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-lg">Submit Your Work</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="submissionLink">Submission Link</Label>
                    <Input
                      id="submissionLink"
                      placeholder="Enter your submission link"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Work"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {task.submissions.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Submissions ({task.submissions.length})</h4>
              {task.submissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{submission.freelancer.slice(0, 6)}...{submission.freelancer.slice(-4)}</p>
                    <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      View Submission
                    </a>
                  </div>
                  {isProvider && !task.isCompleted && !task.isCancelled && (
                    <Button onClick={() => handleApprove(submission.freelancer)}>
                      Approve
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {isProvider && !task.isCompleted && !task.isCancelled && task.submissions.length === 0 && (
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              className="w-full"
            >
              Cancel Task
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetails;