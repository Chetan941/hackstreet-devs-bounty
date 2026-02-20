import { type TaskResponse } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Coins, Clock, CheckCircle2, User, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: TaskResponse;
  currentUserId?: string;
  onClaim?: (id: number) => void;
  onSubmit?: (id: number) => void;
  onApprove?: (id: number) => void;
  isProcessing?: boolean;
}

export function TaskCard({ 
  task, 
  currentUserId, 
  onClaim, 
  onSubmit, 
  onApprove,
  isProcessing = false 
}: TaskCardProps) {
  const isCreator = currentUserId === task.creatorId;
  const isWorker = currentUserId === task.workerId;
  
  const statusColors = {
    OPEN: "bg-green-500/10 text-green-400 border-green-500/20",
    CLAIMED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    SUBMITTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    APPROVED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card hover:border-primary/30 transition-all duration-300 group h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <Badge variant="outline" className={`${statusColors[task.status as keyof typeof statusColors]} border uppercase text-xs font-mono tracking-wider`}>
              {task.status}
            </Badge>
            <div className="flex items-center gap-1.5 text-primary font-bold font-mono bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Coins className="w-4 h-4" />
              {task.rewardAmount} ALGO
            </div>
          </div>
          <h3 className="text-xl font-display font-bold mt-3 group-hover:text-primary transition-colors">
            {task.title}
          </h3>
        </CardHeader>
        
        <CardContent className="flex-grow space-y-4">
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {task.description}
          </p>
          
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-mono mt-auto pt-2">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              Creator: {task.creatorId === currentUserId ? 'You' : 'Anonymous'}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Posted: {format(new Date(task.createdAt), 'MMM d, yyyy')}
            </div>
            {task.contractAppId && (
              <div className="flex items-center gap-1 text-primary/70">
                <ExternalLink className="w-3 h-3" />
                App ID: {task.contractAppId}
              </div>
            )}
          </div>

          {task.status === 'SUBMITTED' && (isCreator || isWorker) && (
            <div className="bg-muted/30 p-3 rounded-md border border-white/5 text-sm">
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Proof of Work:</p>
              <p className="italic mb-2 text-foreground/80">"{task.proofText}"</p>
              {task.proofFileUrl && (
                <a 
                  href={task.proofFileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> View Attachment
                </a>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2">
          {/* Actions for Creator */}
          {isCreator && task.status === 'SUBMITTED' && (
            <Button 
              className="w-full bg-secondary hover:bg-secondary/90 text-white"
              onClick={() => onApprove?.(task.id)}
              disabled={isProcessing}
            >
              {isProcessing ? "Releasing..." : "Approve & Release Funds"}
            </Button>
          )}
          
          {isCreator && task.status === 'OPEN' && (
             <div className="w-full text-center text-xs text-muted-foreground italic py-2">
               Waiting for workers to claim...
             </div>
          )}

          {/* Actions for Worker */}
          {!isCreator && !isWorker && task.status === 'OPEN' && (
            <Button 
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50"
              onClick={() => onClaim?.(task.id)}
              disabled={isProcessing}
            >
              {isProcessing ? "Signing..." : "Claim Task"}
            </Button>
          )}

          {isWorker && task.status === 'CLAIMED' && (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onSubmit?.(task.id)}
              disabled={isProcessing}
            >
              Submit Proof
            </Button>
          )}

          {task.status === 'APPROVED' && (
            <div className="w-full flex items-center justify-center gap-2 text-green-400 text-sm font-medium py-2 bg-green-500/5 rounded-md border border-green-500/10">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
