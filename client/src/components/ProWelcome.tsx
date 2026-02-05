import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ProWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProWelcome({ open, onOpenChange }: ProWelcomeProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-3 p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full w-fit">
            <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Pro
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Your alerts and saved searches are now active.<br />
            You're fully unlocked.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <Sparkles className="w-12 h-12 mx-auto text-primary" />
            <p className="text-muted-foreground">
              Start building your automated deal flow
            </p>
          </div>
          
          <Link href="/watchlist" onClick={() => onOpenChange(false)}>
            <Button 
              size="lg"
              className="w-full gap-2"
              data-testid="button-create-first-search"
            >
              Create Your First Saved Search
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          
          <Link href="/" onClick={() => onOpenChange(false)}>
            <Button 
              variant="outline"
              className="w-full"
              data-testid="button-browse-feed"
            >
              Browse the Feed
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
