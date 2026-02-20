import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertTaskSchema } from "@shared/schema";
import { useCreateTask } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Coins } from "lucide-react";

// Frontend validation schema
const formSchema = insertTaskSchema.extend({
  rewardAmount: z.coerce.number().min(0.1, "Minimum reward is 0.1 ALGO"),
});

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createTask = useCreateTask();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      rewardAmount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Mock Algorand transaction delay
      toast({
        title: "Initializing Smart Contract",
        description: "Deploying escrow contract on Algorand Testnet...",
        duration: 2000,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await createTask.mutateAsync({
        ...values,
        rewardAmount: values.rewardAmount.toString(),
      });

      toast({
        title: "Success",
        description: "Bounty task created and funds locked in escrow!",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
          <Plus className="w-4 h-4 mr-2" />
          Create Bounty
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-card border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-primary">Create New Bounty</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Define the task and lock ALGO in an escrow smart contract.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Design a logo for my dApp" 
                      className="bg-background/50 border-white/10 focus:border-primary/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description & Requirements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what needs to be done..." 
                      className="bg-background/50 border-white/10 focus:border-primary/50 min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rewardAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward (ALGO)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        step="0.1" 
                        placeholder="0.00"
                        className="bg-background/50 border-white/10 focus:border-primary/50 pl-10" 
                        {...field} 
                      />
                      <Coins className="w-4 h-4 text-primary absolute left-3 top-3" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-teal-400 hover:to-teal-500 text-primary-foreground font-bold"
              disabled={createTask.isPending}
            >
              {createTask.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Locking Funds...
                </>
              ) : (
                "Create Bounty & Lock Funds"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
