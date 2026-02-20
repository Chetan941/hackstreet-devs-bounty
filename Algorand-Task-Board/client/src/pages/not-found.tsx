import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-display">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            The decentralized resource you are looking for has been moved or does not exist on this block.
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
