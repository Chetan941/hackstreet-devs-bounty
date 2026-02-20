import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Wallet, Loader2, Check } from "lucide-react";

const schema = z.object({
  address: z.string().min(58, "Invalid Algorand address").max(58, "Invalid Algorand address"),
});

export function WalletConnect() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateProfile.mutate({ algorandAddress: data.address }, {
      onSuccess: () => {
        toast({
          title: "Wallet Connected",
          description: "Your Algorand wallet has been linked successfully.",
        });
        setOpen(false);
      }
    });
  };

  if (isLoading) return <div className="animate-pulse h-10 w-32 bg-white/10 rounded-md"></div>;

  if (profile?.algorandAddress) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
        <Wallet className="w-4 h-4 text-primary" />
        <span className="text-sm font-mono text-primary/80">
          {profile.algorandAddress.slice(0, 4)}...{profile.algorandAddress.slice(-4)}
        </span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-white/10">
        <DialogHeader>
          <DialogTitle>Connect Algorand Wallet</DialogTitle>
          <DialogDescription>
            Enter your public Algorand address to receive payments or fund bounties.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Enter address (58 chars)..." 
                      className="font-mono text-xs"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Address"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
