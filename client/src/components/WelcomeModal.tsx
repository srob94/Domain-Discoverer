import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, Zap } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onSetPreferences: () => void;
  onSkip: () => void;
}

export function WelcomeModal({ open, onSetPreferences, onSkip }: WelcomeModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-3 p-3 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full w-fit animate-score-up">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Welcome to TLDTerminal
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Your daily ranked drop feed is live. Let's personalize it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={onSetPreferences}
            data-testid="button-set-preferences"
          >
            <Zap className="w-4 h-4" />
            Set Preferences (30 seconds)
          </Button>

          <button
            onClick={onSkip}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            data-testid="button-skip-onboarding"
          >
            Skip for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
