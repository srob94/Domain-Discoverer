import { cn } from "@/lib/utils";
import type { DomainStatus } from "@shared/schema";

interface StatusPillProps {
  status: DomainStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const statusStyles = {
    dropping: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    expiring: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
  };

  const statusLabels = {
    dropping: "Dropping",
    expiring: "Expiring"
  };

  return (
    <span
      data-testid={`status-pill-${status}`}
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
