import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import type { AdminSettings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Settings, Globe, DollarSign, Sparkles, TrendingUp, Users, X, Plus } from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [newEnabledTld, setNewEnabledTld] = useState("");
  const [newBlockedTld, setNewBlockedTld] = useState("");

  const { data: settings, isLoading } = useQuery<AdminSettings>({
    queryKey: ["/api/admin/settings"]
  });

  const [localSettings, setLocalSettings] = useState<AdminSettings | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (newSettings: AdminSettings) => {
      return apiRequest("PUT", "/api/admin/settings", newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Settings saved" });
    },
    onError: () => {
      toast({ title: "Failed to save settings", variant: "destructive" });
    }
  });

  const handleSave = () => {
    if (localSettings) {
      updateMutation.mutate(localSettings);
    }
  };

  const addEnabledTld = () => {
    if (!newEnabledTld.startsWith(".")) return;
    if (localSettings && !localSettings.enabledTlds.includes(newEnabledTld)) {
      setLocalSettings({
        ...localSettings,
        enabledTlds: [...localSettings.enabledTlds, newEnabledTld]
      });
      setNewEnabledTld("");
    }
  };

  const removeEnabledTld = (tld: string) => {
    if (localSettings) {
      setLocalSettings({
        ...localSettings,
        enabledTlds: localSettings.enabledTlds.filter(t => t !== tld)
      });
    }
  };

  const addBlockedTld = () => {
    if (!newBlockedTld.startsWith(".")) return;
    if (localSettings && !localSettings.blockedTlds.includes(newBlockedTld)) {
      setLocalSettings({
        ...localSettings,
        blockedTlds: [...localSettings.blockedTlds, newBlockedTld]
      });
      setNewBlockedTld("");
    }
  };

  const removeBlockedTld = (tld: string) => {
    if (localSettings) {
      setLocalSettings({
        ...localSettings,
        blockedTlds: localSettings.blockedTlds.filter(t => t !== tld)
      });
    }
  };

  const toggleFeatureFlag = (flag: keyof AdminSettings["featureFlags"]) => {
    if (localSettings) {
      setLocalSettings({
        ...localSettings,
        featureFlags: {
          ...localSettings.featureFlags,
          [flag]: !localSettings.featureFlags[flag]
        }
      });
    }
  };

  if (isLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Admin Settings
        </h1>
        <Button onClick={handleSave} disabled={updateMutation.isPending} data-testid="button-save-settings">
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Enabled TLDs
            </CardTitle>
            <CardDescription>TLDs that appear in the domain feed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {localSettings.enabledTlds.map((tld) => (
                <Badge key={tld} variant="secondary" className="gap-1 pr-1">
                  {tld}
                  <button
                    onClick={() => removeEnabledTld(tld)}
                    className="ml-1 p-0.5 hover:bg-destructive/20 rounded"
                    data-testid={`button-remove-enabled-${tld}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder=".xyz"
                value={newEnabledTld}
                onChange={(e) => setNewEnabledTld(e.target.value)}
                className="max-w-32"
                data-testid="input-new-enabled-tld"
              />
              <Button size="icon" variant="outline" onClick={addEnabledTld} data-testid="button-add-enabled-tld">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Globe className="w-5 h-5" />
              Blocked TLDs
            </CardTitle>
            <CardDescription>TLDs excluded from the domain feed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {localSettings.blockedTlds.map((tld) => (
                <Badge key={tld} variant="destructive" className="gap-1 pr-1">
                  {tld}
                  <button
                    onClick={() => removeBlockedTld(tld)}
                    className="ml-1 p-0.5 hover:bg-background/20 rounded"
                    data-testid={`button-remove-blocked-${tld}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder=".spam"
                value={newBlockedTld}
                onChange={(e) => setNewBlockedTld(e.target.value)}
                className="max-w-32"
                data-testid="input-new-blocked-tld"
              />
              <Button size="icon" variant="outline" onClick={addBlockedTld} data-testid="button-add-blocked-tld">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing Thresholds
            </CardTitle>
            <CardDescription>Configure premium renewal warnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Premium Renewal Threshold</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="threshold"
                  type="number"
                  value={localSettings.premiumRenewalThreshold}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    premiumRenewalThreshold: parseInt(e.target.value) || 0
                  })}
                  className="max-w-32"
                  data-testid="input-premium-threshold"
                />
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Domains with renewal costs above this will be flagged as premium
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Feature Flags
            </CardTitle>
            <CardDescription>Toggle features for all users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="aiBuilder">AI Domain Builder</Label>
              </div>
              <Switch
                id="aiBuilder"
                checked={localSettings.featureFlags.aiBuilder}
                onCheckedChange={() => toggleFeatureFlag("aiBuilder")}
                data-testid="switch-ai-builder"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="trendBadges">Trend Badges</Label>
              </div>
              <Switch
                id="trendBadges"
                checked={localSettings.featureFlags.trendBadges}
                onCheckedChange={() => toggleFeatureFlag("trendBadges")}
                data-testid="switch-trend-badges"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="investorInterest">Investor Interest Counts</Label>
              </div>
              <Switch
                id="investorInterest"
                checked={localSettings.featureFlags.investorInterest}
                onCheckedChange={() => toggleFeatureFlag("investorInterest")}
                data-testid="switch-investor-interest"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
