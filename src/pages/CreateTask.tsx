
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ContractService } from "@/lib/contractService";
import { taskApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { CurrencyService } from "@/lib/currencyService";

interface TaskFormData {
  title: string;
  description: string;
  bounty: string;
  currency: string;
  deadline: Date | undefined;
  category: string;
  difficulty: string;
  estimatedDuration: string;
  skills: string;
  requirements: string;
}

const CreateTask = () => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    bounty: "",
    currency: "ETN",
    deadline: undefined,
    category: "",
    difficulty: "",
    estimatedDuration: "",
    skills: "",
    requirements: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.bounty || !formData.deadline) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title, bounty and deadline",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get current wallet address
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // If MetaMask is not connected, prompt user to connect
      if (!accounts || accounts.length === 0) {
        toast({
          title: "Wallet not connected",
          description: "Please connect your MetaMask wallet to create a task",
          variant: "destructive",
        });
        
        await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        return;
      }

      // Hardcode value for demo purposes
      const taskId = 1;

      // Convert amount if not in ETN
      let etnAmount = parseFloat(formData.bounty);
      if (formData.currency !== "ETN") {
        etnAmount = await CurrencyService.convertToETN(
          parseFloat(formData.bounty), 
          formData.currency.toLowerCase()
        );
        
        // Show confirmation with converted amount
        const shouldProceed = window.confirm(
          `This task will cost approximately ${etnAmount.toFixed(6)} ETN. Do you want to proceed?`
        );
        
        if (!shouldProceed) {
          setIsSubmitting(false);
          return;
        }
      }

      // Create task on blockchain with minimal data
      const deadline = Math.floor(formData.deadline.getTime() / 1000);
      const tx = await ContractService.createTask(
        formData.title,
        deadline,
        formData.bounty
      );
      
      // Wait for transaction confirmation
      await tx.wait();

      console.log("Deadline:", deadline)

      // After successful blockchain transaction, create detailed task in backend
      await taskApi.createTask({
        id: Number(taskId),
        title: formData.title,
        description: formData.description,
        bounty: Number(formData.bounty),
        deadline: Math.floor(formData.deadline.getTime() / 1000).toString(),
        providerId: "DemoProviderId", // Replace with actual wallet address
        category: formData.category,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        attachments: []
      });
      
      toast({
        title: "Task created successfully",
        description: "Your task has been posted successfully",
      });
      
      navigate("/my-tasks");
    } catch (error) {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Task</CardTitle>
          <CardDescription>
            Create a new task and set a bounty for freelancers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your task requirements..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="bounty">Bounty*</Label>
                  <Input
                    id="bounty"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={formData.bounty}
                    onChange={(e) => handleInputChange("bounty", e.target.value)}
                  />
                </div>
                <div className="w-1/3">
                  <Label>Currency</Label>
                  <Select onValueChange={(value) => handleInputChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={formData.currency || "ETN"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETN">ETN</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Deadline *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "PPP") : "Select deadline"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => handleInputChange("deadline", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select onValueChange={(value) => handleInputChange("difficulty", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated Duration</Label>
              <Input
                id="estimatedDuration"
                placeholder="e.g., 2 weeks"
                value={formData.estimatedDuration}
                onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., React, TypeScript, UI/UX"
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Separate skills with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Additional Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List any specific requirements or qualifications needed..."
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Task...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTask;
