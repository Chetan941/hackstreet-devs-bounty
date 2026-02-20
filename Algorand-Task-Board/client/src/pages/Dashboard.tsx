import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTasks, useClaimTask, useApproveTask } from "@/hooks/use-tasks";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { WalletConnect } from "@/components/WalletConnect";
import { SubmitProofDialog } from "@/components/SubmitProofDialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  // State for submitting proof dialog
  const [submitTaskId, setSubmitTaskId] = useState<number | null>(null);
  
  // Queries
  const { data: allTasks, isLoading: loadingAll } = useTasks(
    activeTab === "all" ? { status: "OPEN" } : undefined
  );
  
  const { data: myTasks, isLoading: loadingMy } = useTasks(
    activeTab === "my-tasks" ? { role: "creator" } : undefined
  );

  const { data: myWork, isLoading: loadingWork } = useTasks(
    activeTab === "my-work" ? { role: "worker" } : undefined
  );

  // Mutations
  const claimTask = useClaimTask();
  const approveTask = useApproveTask();

  const handleClaim = (id: number) => {
    claimTask.mutate(id, {
      onSuccess: () => toast({ title: "Task Claimed", description: "You can now start working on this task." }),
      onError: () => toast({ title: "Error", description: "Failed to claim task", variant: "destructive" }),
    });
  };

  const handleSubmitProof = (id: number) => {
    setSubmitTaskId(id);
  };

  const handleApprove = (id: number) => {
    toast({ title: "Releasing Funds...", description: "Interacting with Algorand Smart Contract..." });
    setTimeout(() => {
      approveTask.mutate(id, {
        onSuccess: () => toast({ title: "Payment Sent", description: "Worker has been paid." }),
        onError: () => toast({ title: "Error", description: "Failed to release funds", variant: "destructive" }),
      });
    }, 1500); // Mock contract delay
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold font-display text-lg">A</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden md:inline">AlgoBounties</span>
          </div>

          <div className="flex items-center gap-4">
            <WalletConnect />
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <img 
                src={user?.profileImageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${user?.id}`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full ring-2 ring-white/10"
              />
              <button 
                onClick={() => logout()}
                className="text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your bounties and tasks.</p>
          </div>
          <CreateTaskDialog />
        </div>

        <Tabs defaultValue="all" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="bg-card/50 border border-white/10 p-1">
            <TabsTrigger value="all">Open Bounties</TabsTrigger>
            <TabsTrigger value="my-tasks">My Created Tasks</TabsTrigger>
            <TabsTrigger value="my-work">My Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {loadingAll ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
            ) : allTasks?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No open tasks found. Be the first to create one!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTasks?.map((task: any) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    currentUserId={user?.id}
                    onClaim={handleClaim}
                    isProcessing={claimTask.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-tasks" className="space-y-6">
            {loadingMy ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
            ) : myTasks?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">You haven't created any tasks yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTasks?.map((task: any) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    currentUserId={user?.id}
                    onApprove={handleApprove}
                    isProcessing={approveTask.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-work" className="space-y-6">
            {loadingWork ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
            ) : myWork?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">You haven't claimed any tasks yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myWork?.map((task: any) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    currentUserId={user?.id}
                    onSubmit={handleSubmitProof}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <SubmitProofDialog 
        taskId={submitTaskId} 
        open={!!submitTaskId} 
        onOpenChange={(open) => !open && setSubmitTaskId(null)} 
      />
    </div>
  );
}
