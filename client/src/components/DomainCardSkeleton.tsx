import { Card } from "@/components/ui/card";

export function DomainCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-36 rounded-md skeleton-shimmer" />
                <div className="h-5 w-20 rounded-full skeleton-shimmer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 rounded-full skeleton-shimmer" />
                <div className="h-4 w-24 rounded skeleton-shimmer" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg skeleton-shimmer" />
          </div>
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
            <div className="space-y-1">
              <div className="h-4 w-14 rounded skeleton-shimmer" />
              <div className="h-5 w-20 rounded skeleton-shimmer" />
            </div>
            <div className="h-4 w-24 rounded skeleton-shimmer" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <div className="h-8 flex-1 rounded-md skeleton-shimmer" />
            <div className="h-8 flex-1 rounded-md skeleton-shimmer" />
          </div>
        </div>
      </Card>
    </div>
  );
}
