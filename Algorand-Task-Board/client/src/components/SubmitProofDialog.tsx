import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitTask } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const schema = z.object({
  proofText: z.string().min(10, "Please provide more detail about your work"),
  proofFileUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

interface SubmitProofDialogProps {
  taskId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitProofDialog({ taskId, open, onOpenChange }: SubmitProofDialogProps) {
  const submitTask = useSubmitTask();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      proofText: "",
      proofFileUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!taskId) return;
    try {
      await submitTask.mutateAsync({
        id: taskId,
        proofText: values.proofText,
        proofFileUrl: values.proofFileUrl || undefined,
      });
      toast({ title: "Proof Submitted", description: "Waiting for creator approval." });
      onOpenChange(false);
      form.reset();
    } catch (err) {
      toast({ title: "Error", description: "Failed to submit proof.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10">
        <DialogHeader>
          <DialogTitle>Submit Proof of Work</DialogTitle>
          <DialogDescription>
            Provide details or links to your completed work for the task creator to review.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="proofText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="I completed the task by..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proofFileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={submitTask.isPending}>
              {submitTask.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Submit Work"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
