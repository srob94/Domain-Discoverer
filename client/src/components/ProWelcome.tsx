import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import confetti from "canvas-confetti";

interface ProWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONFETTI_SESSION_KEY = "tld_confetti_fired";

export function ProWelcome({ open, onOpenChange }: ProWelcomeProps) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    const alreadyFired = sessionStorage.getItem(CONFETTI_SESSION_KEY) === "true";
    if (open && !alreadyFired && !hasTriggered.current) {
      hasTriggered.current = true;
      sessionStorage.setItem(CONFETTI_SESSION_KEY, "true");

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#f59e0b", "#3b82f6", "#10b981"],
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#f59e0b", "#3b82f6", "#10b981"],
          disableForReducedMotion: true,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      setTimeout(frame, 200);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-3 p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full w-fit animate-score-up">
            <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Welcome to Pro
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Your alerts and saved searches are now active.<br />
            You're fully unlocked.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center space-y-2 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Sparkles className="w-12 h-12 mx-auto text-primary" />
            <p className="text-muted-foreground">
              Start building your automated deal flow
            </p>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
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
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
