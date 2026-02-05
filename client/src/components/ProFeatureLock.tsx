import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface ProFeatureLockProps {
  feature: string;
  description?: string;
  children: React.ReactNode;
}

export function ProFeatureLock({ feature, description, children }: ProFeatureLockProps) {
  const { isPro, isLoggedIn, triggerUpgrade } = useUser();

  if (isPro) {
    return <>{children}</>;
  }

  const handleUnlock = () => {
    if (!isLoggedIn) {
      triggerUpgrade(`Sign up to access ${feature}`);
    } else {
      triggerUpgrade(`${feature} is a Pro feature. Upgrade to unlock.`);
    }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-40 blur-[2px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6 max-w-sm">
          <div className="mx-auto mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full w-fit">
            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">{feature}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          )}
          <Button 
            onClick={handleUnlock}
            className="gap-2"
            data-testid="button-unlock-feature"
          >
            <Crown className="w-4 h-4" />
            {isLoggedIn ? "Upgrade to Pro" : "Sign Up to Unlock"}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ProBadgeLockProps {
  onClick?: () => void;
}

export function ProBadgeLock({ onClick }: ProBadgeLockProps) {
  const { triggerUpgrade } = useUser();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      triggerUpgrade("This feature requires Pro");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full hover-elevate cursor-pointer"
      data-testid="badge-pro-locked"
    >
      <Lock className="w-3 h-3" />
      Pro
    </button>
  );
}
