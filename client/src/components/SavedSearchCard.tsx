import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, BellOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SavedSearch } from "@shared/schema";

interface SavedSearchCardProps {
  search: SavedSearch;
  onToggleAlerts?: (id: string, enabled: boolean) => void;
  onDelete?: (id: string) => void;
}

export function SavedSearchCard({ search, onToggleAlerts, onDelete }: SavedSearchCardProps) {
  return (
    <Card 
      data-testid={`saved-search-card-${search.id}`}
      className="p-4 hover-elevate transition-all duration-200"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-md">
              <Search className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{search.name}</h3>
              <p className="text-sm text-muted-foreground">
                {search.matchCount} matches
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete?.(search.id)}
            data-testid={`delete-search-${search.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1">
          {search.tlds.map((tld) => (
            <Badge key={tld} variant="secondary" className="text-xs">
              {tld}
            </Badge>
          ))}
          {search.minScore > 0 && (
            <Badge variant="outline" className="text-xs">
              {search.minScore}+ score
            </Badge>
          )}
        </div>

        {search.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {search.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline" className="text-xs bg-muted/50">
                {keyword}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {search.alertsEnabled ? (
              <Bell className="w-4 h-4 text-primary" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
            <span>Alerts {search.alertsEnabled ? "on" : "off"}</span>
          </div>
          <Switch
            data-testid={`toggle-alerts-${search.id}`}
            checked={search.alertsEnabled}
            onCheckedChange={(checked) => onToggleAlerts?.(search.id, checked)}
          />
        </div>
      </div>
    </Card>
  );
}
