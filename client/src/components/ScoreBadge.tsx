import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreBadge({ score, size = "md", className }: ScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500 text-white";
    if (score >= 80) return "bg-emerald-400 text-white";
    if (score >= 70) return "bg-amber-400 text-amber-950";
    if (score >= 60) return "bg-orange-400 text-orange-950";
    return "bg-red-400 text-white";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 min-w-[32px]",
    md: "text-sm px-2.5 py-1 min-w-[40px]",
    lg: "text-base px-3 py-1.5 min-w-[48px]"
  };

  return (
    <span
      data-testid={`score-badge-${score}`}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-md tabular-nums",
        getScoreColor(score),
        sizeClasses[size],
        className
      )}
    >
      {score}
    </span>
  );
}
