import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { tldOptions } from "@/lib/mockData";
import type { InsertSavedSearch, DomainStatus } from "@shared/schema";

interface SavedSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (search: InsertSavedSearch) => void;
}

export function SavedSearchModal({ open, onOpenChange, onSave }: SavedSearchModalProps) {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedTlds, setSelectedTlds] = useState<string[]>([".com"]);
  const [status, setStatus] = useState<DomainStatus | "all">("all");
  const [minScore, setMinScore] = useState(75);
  const [maxRenewalCost, setMaxRenewalCost] = useState<string>("");
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim().toLowerCase())) {
      setKeywords([...keywords, keywordInput.trim().toLowerCase()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const toggleTld = (tld: string) => {
    if (selectedTlds.includes(tld)) {
      if (selectedTlds.length > 1) {
        setSelectedTlds(selectedTlds.filter((t) => t !== tld));
      }
    } else {
      setSelectedTlds([...selectedTlds, tld]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave({
      name: name.trim(),
      keywords,
      tlds: selectedTlds,
      status,
      minScore,
      maxRenewalCost: maxRenewalCost ? parseFloat(maxRenewalCost) : null,
      alertsEnabled
    });

    setName("");
    setKeywords([]);
    setSelectedTlds([".com"]);
    setStatus("all");
    setMinScore(75);
    setMaxRenewalCost("");
    setAlertsEnabled(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="saved-search-modal">
        <DialogHeader>
          <DialogTitle>Create Saved Search</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="search-name">Search Name</Label>
            <Input
              id="search-name"
              data-testid="input-search-name"
              placeholder="e.g., Tech Startups"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Keywords</Label>
            <div className="flex gap-2">
              <Input
                data-testid="input-keyword"
                placeholder="Add keyword..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
              />
              <Button
                data-testid="button-add-keyword"
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddKeyword}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-0.5 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label>TLDs</Label>
            <div className="flex flex-wrap gap-1.5">
              {tldOptions.filter(t => t.value !== "all").map((tld) => (
                <Badge
                  key={tld.value}
                  data-testid={`tld-chip-${tld.value}`}
                  variant={selectedTlds.includes(tld.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTld(tld.value)}
                >
                  {tld.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status-select">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as DomainStatus | "all")}>
              <SelectTrigger id="status-select" data-testid="select-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="dropping">Dropping Only</SelectItem>
                <SelectItem value="expiring">Expiring Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Minimum Score</Label>
              <span className="text-sm font-medium text-muted-foreground">{minScore}+</span>
            </div>
            <Slider
              data-testid="slider-min-score"
              value={[minScore]}
              onValueChange={([value]) => setMinScore(value)}
              min={0}
              max={100}
              step={5}
              className="py-2"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="max-renewal">Max Renewal Cost (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="max-renewal"
                data-testid="input-max-renewal"
                type="number"
                placeholder="No limit"
                value={maxRenewalCost}
                onChange={(e) => setMaxRenewalCost(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="alerts-toggle">Enable Alerts</Label>
              <p className="text-xs text-muted-foreground">Get notified when new matches are found</p>
            </div>
            <Switch
              id="alerts-toggle"
              data-testid="toggle-alerts"
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name.trim()}
            data-testid="button-save-search"
          >
            Save Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
