import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { tldOptions, scoreOptions } from "@/lib/mockData";
import type { DomainFilters } from "@shared/schema";

interface FilterBarProps {
  filters: DomainFilters;
  onFiltersChange: (filters: DomainFilters) => void;
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const hasActiveFilters = 
    filters.tld !== "all" || 
    filters.minScore > 0 || 
    filters.premiumOnly;

  const clearFilters = () => {
    onFiltersChange({
      tld: "all",
      minScore: 0,
      premiumOnly: false,
      searchQuery: filters.searchQuery
    });
  };

  return (
    <div 
      data-testid="filter-bar"
      className="flex flex-wrap items-center gap-3 p-4 bg-card border border-card-border rounded-lg"
    >
      <div className="flex items-center gap-2">
        <Label htmlFor="tld-select" className="text-sm text-muted-foreground whitespace-nowrap">
          TLD
        </Label>
        <Select
          value={filters.tld}
          onValueChange={(value) => onFiltersChange({ ...filters, tld: value })}
        >
          <SelectTrigger 
            id="tld-select" 
            data-testid="select-tld"
            className="w-[120px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tldOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="score-select" className="text-sm text-muted-foreground whitespace-nowrap">
          Min Score
        </Label>
        <Select
          value={filters.minScore.toString()}
          onValueChange={(value) => onFiltersChange({ ...filters, minScore: parseInt(value) })}
        >
          <SelectTrigger 
            id="score-select" 
            data-testid="select-min-score"
            className="w-[120px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {scoreOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="premium-toggle"
          data-testid="toggle-premium-renewal"
          checked={filters.premiumOnly}
          onCheckedChange={(checked) => onFiltersChange({ ...filters, premiumOnly: checked })}
        />
        <Label htmlFor="premium-toggle" className="text-sm text-muted-foreground cursor-pointer">
          Premium Renewal Only
        </Label>
      </div>

      {hasActiveFilters && (
        <Button
          data-testid="button-clear-filters"
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="ml-auto"
        >
          <X className="w-4 h-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
