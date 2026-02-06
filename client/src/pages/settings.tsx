import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Settings as SettingsIcon, Globe, Target, DollarSign, Bell, Clock, Mail, Check, Save, Lock } from "lucide-react";
import type { OnboardingPreferences, NotificationSettings } from "@shared/schema";

const TLD_OPTIONS = [
  { value: ".com", label: ".com" },
  { value: ".io", label: ".io" },
  { value: ".ai", label: ".ai" },
  { value: ".net", label: ".net" },
  { value: ".co", label: ".co" },
  { value: ".dev", label: ".dev" },
  { value: ".xyz", label: ".xyz" },
  { value: ".app", label: ".app" },
];

const INVESTOR_STYLES = [
  { value: "brandable", label: "Brandable names", description: "Catchy, memorable brand-ready domains" },
  { value: "keyword", label: "Keyword domains", description: "SEO-friendly exact-match keywords" },
  { value: "short", label: "Short domains", description: "Under 6 characters, premium resale" },
  { value: "ai_startup", label: "AI/startup niches", description: "Tech, AI, and startup-focused names" },
];

const RENEWAL_OPTIONS = [
  { value: 30, label: "Under $30/year" },
  { value: 100, label: "Under $100/year" },
  { value: 500, label: "Show all" },
];

const NOTIFY_WINDOWS = [
  { value: 24, label: "24 hours before" },
  { value: 12, label: "12 hours before" },
  { value: 3, label: "3 hours before" },
];

interface PreferencesData {
  onboardingCompleted: boolean;
  preferredTlds: string[] | null;
  investorStyle: string | null;
  renewalSensitivity: number | null;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const { isPro } = useUser();

  const [selectedTlds, setSelectedTlds] = useState<string[]>([".com"]);
  const [investorStyle, setInvestorStyle] = useState("brandable");
  const [renewalSensitivity, setRenewalSensitivity] = useState(30);

  const [dropAlerts, setDropAlerts] = useState(true);
  const [searchAlerts, setSearchAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [notifyWindow, setNotifyWindow] = useState(12);

  const [prefsChanged, setPrefsChanged] = useState(false);
  const [alertsChanged, setAlertsChanged] = useState(false);

  const { data: prefs, isLoading: prefsLoading } = useQuery<PreferencesData>({
    queryKey: ["/api/onboarding/preferences"],
  });

  const { data: notifications, isLoading: notifsLoading } = useQuery<NotificationSettings>({
    queryKey: ["/api/settings/notifications"],
  });

  useEffect(() => {
    if (prefs) {
      setSelectedTlds(prefs.preferredTlds || [".com"]);
      setInvestorStyle(prefs.investorStyle || "brandable");
      setRenewalSensitivity(prefs.renewalSensitivity ?? 30);
    }
  }, [prefs]);

  useEffect(() => {
    if (notifications) {
      setDropAlerts(notifications.dropAlertsEnabled);
      setSearchAlerts(notifications.searchAlertsEnabled);
      setWeeklyDigest(notifications.weeklyDigestEnabled);
      setNotifyWindow(notifications.notifyWindowHours);
    }
  }, [notifications]);

  const savePrefsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/onboarding/preferences", {
        preferredTlds: selectedTlds,
        investorStyle,
        renewalSensitivity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/preferences"] });
      setPrefsChanged(false);
      toast({ title: "Preferences saved" });
    },
    onError: () => {
      toast({ title: "Failed to save preferences", variant: "destructive" });
    },
  });

  const saveAlertsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", "/api/settings/notifications", {
        dropAlertsEnabled: dropAlerts,
        searchAlertsEnabled: searchAlerts,
        weeklyDigestEnabled: weeklyDigest,
        notifyWindowHours: notifyWindow,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/notifications"] });
      setAlertsChanged(false);
      toast({ title: "Notification settings saved" });
    },
    onError: () => {
      toast({ title: "Failed to save notification settings", variant: "destructive" });
    },
  });

  const toggleTld = (tld: string) => {
    const updated = selectedTlds.includes(tld)
      ? selectedTlds.filter(t => t !== tld)
      : [...selectedTlds, tld];
    if (updated.length > 0) {
      setSelectedTlds(updated);
      setPrefsChanged(true);
    }
  };

  const isLoading = prefsLoading || notifsLoading;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        {[1, 2].map(i => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2" data-testid="text-settings-title">
          <SettingsIcon className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your feed preferences and notification settings.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            Preferred Extensions
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {TLD_OPTIONS.map(tld => (
            <Badge
              key={tld.value}
              variant={selectedTlds.includes(tld.value) ? "default" : "outline"}
              className={`cursor-pointer text-sm px-3 py-1.5 toggle-elevate ${selectedTlds.includes(tld.value) ? "toggle-elevated" : ""}`}
              onClick={() => toggleTld(tld.value)}
              data-testid={`settings-tld-${tld.value}`}
            >
              {tld.label}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-muted-foreground" />
          Investor Style
        </h3>
        <div className="space-y-2">
          {INVESTOR_STYLES.map(style => (
            <div
              key={style.value}
              role="button"
              tabIndex={0}
              onClick={() => { setInvestorStyle(style.value); setPrefsChanged(true); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setInvestorStyle(style.value); setPrefsChanged(true); } }}
              className={`w-full text-left p-3 rounded-md border cursor-pointer toggle-elevate ${
                investorStyle === style.value ? "toggle-elevated border-primary" : "border-border"
              }`}
              data-testid={`settings-style-${style.value}`}
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{style.label}</p>
                  <p className="text-xs text-muted-foreground">{style.description}</p>
                </div>
                {investorStyle === style.value && (
                  <Check className="w-4 h-4 text-primary ml-auto shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          Renewal Sensitivity
        </h3>
        <Select
          value={String(renewalSensitivity)}
          onValueChange={(val) => { setRenewalSensitivity(Number(val)); setPrefsChanged(true); }}
        >
          <SelectTrigger data-testid="settings-select-renewal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RENEWAL_OPTIONS.map(option => (
              <SelectItem key={option.value} value={String(option.value)} data-testid={`option-renewal-${option.value}`}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">
          Domains above this renewal cost will be flagged as premium renewals in your feed.
        </p>
      </Card>

      {prefsChanged && (
        <div className="sticky bottom-4 z-50">
          <Card className="p-3 flex items-center justify-between gap-3 border-primary/30 bg-background/95 backdrop-blur">
            <span className="text-sm text-muted-foreground">You have unsaved preference changes.</span>
            <Button
              size="sm"
              onClick={() => savePrefsMutation.mutate()}
              disabled={savePrefsMutation.isPending || selectedTlds.length === 0}
              data-testid="button-save-preferences"
            >
              <Save className="w-4 h-4 mr-1" />
              {savePrefsMutation.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </Card>
        </div>
      )}

      <Separator className="my-2" />

      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-muted-foreground" />
          Email Alerts
        </h3>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Drop alerts</Label>
              <p className="text-xs text-muted-foreground">Get notified when watched domains are about to drop.</p>
            </div>
            <Switch
              checked={dropAlerts}
              onCheckedChange={(val) => { setDropAlerts(val); setAlertsChanged(true); }}
              data-testid="switch-drop-alerts"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  Saved search alerts
                  {!isPro && <Lock className="w-3 h-3 text-muted-foreground" />}
                </Label>
                <p className="text-xs text-muted-foreground">Get notified when new domains match your saved searches.</p>
              </div>
            </div>
            <Switch
              checked={searchAlerts}
              onCheckedChange={(val) => { setSearchAlerts(val); setAlertsChanged(true); }}
              disabled={!isPro}
              data-testid="switch-search-alerts"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Weekly digest</Label>
              <p className="text-xs text-muted-foreground">Receive a weekly summary of top dropping domains.</p>
            </div>
            <Switch
              checked={weeklyDigest}
              onCheckedChange={(val) => { setWeeklyDigest(val); setAlertsChanged(true); }}
              data-testid="switch-weekly-digest"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Alert Timing
        </h3>
        <div>
          <Label className="text-sm">Notify me when a domain drops in:</Label>
          <Select
            value={String(notifyWindow)}
            onValueChange={(val) => { setNotifyWindow(Number(val)); setAlertsChanged(true); }}
          >
            <SelectTrigger className="mt-2" data-testid="settings-select-notify-window">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NOTIFY_WINDOWS.map(option => (
                <SelectItem key={option.value} value={String(option.value)} data-testid={`option-window-${option.value}`}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {alertsChanged && (
        <div className="sticky bottom-4 z-50">
          <Card className="p-3 flex items-center justify-between gap-3 border-primary/30 bg-background/95 backdrop-blur">
            <span className="text-sm text-muted-foreground">You have unsaved notification changes.</span>
            <Button
              size="sm"
              onClick={() => saveAlertsMutation.mutate()}
              disabled={saveAlertsMutation.isPending}
              data-testid="button-save-notifications"
            >
              <Save className="w-4 h-4 mr-1" />
              {saveAlertsMutation.isPending ? "Saving..." : "Save Notifications"}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
