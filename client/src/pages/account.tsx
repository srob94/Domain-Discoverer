import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { User, Crown, Calendar, Eye, Search, Sparkles, LogOut, Save, Bookmark, FileText, Shield } from "lucide-react";
import { Link } from "wouter";

interface AccountData {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  isPro: boolean;
  isAdmin: boolean;
  createdAt: string | null;
  watchlistCount: number;
  watchlistLimit: number;
  savedSearchCount: number;
  aiSearchesUsed: number;
  aiSearchesLimit: number;
}

export default function Account() {
  const { toast } = useToast();
  const { isPro } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { data: account, isLoading } = useQuery<AccountData>({
    queryKey: ["/api/account"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      return apiRequest("PATCH", "/api/account", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/account"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
      toast({ title: "Profile updated" });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const startEditing = () => {
    setFirstName(account?.firstName || "");
    setLastName(account?.lastName || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate({ firstName, lastName });
  };

  const getInitials = () => {
    if (account?.firstName && account?.lastName) {
      return `${account.firstName[0]}${account.lastName[0]}`.toUpperCase();
    }
    if (account?.email) {
      return account.email[0].toUpperCase();
    }
    return "U";
  };

  const memberSince = account?.createdAt
    ? new Date(account.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-muted animate-pulse rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2" data-testid="text-account-title">
          <User className="w-6 h-6 text-primary" />
          Account
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and view your account details.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={account?.profileImageUrl || undefined} alt={account?.firstName || "User"} />
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-save-profile"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    data-testid="button-cancel-edit"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold text-foreground" data-testid="text-user-name">
                    {account?.firstName
                      ? `${account.firstName} ${account.lastName || ""}`.trim()
                      : "No name set"}
                  </h2>
                  {isPro ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      data-testid="badge-plan"
                    >
                      <Crown className="w-3 h-3" />
                      Pro
                    </Badge>
                  ) : (
                    <Badge variant="outline" data-testid="badge-plan">
                      Starter
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-user-email">
                  {account?.email || "No email"}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span data-testid="text-member-since">Member since {memberSince}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startEditing}
                  className="mt-2 -ml-2"
                  data-testid="button-edit-profile"
                >
                  Edit profile
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Usage</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span>Watchlist</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" data-testid="text-watchlist-usage">
                {account?.watchlistCount} / {account?.watchlistLimit}
              </span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.min(((account?.watchlistCount || 0) / (account?.watchlistLimit || 10)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Bookmark className="w-4 h-4 text-muted-foreground" />
              <span>Saved Searches</span>
            </div>
            <div className="text-sm">
              {isPro ? (
                <span className="font-medium" data-testid="text-searches-count">{account?.savedSearchCount} created</span>
              ) : (
                <Badge variant="outline" className="text-xs" data-testid="text-searches-locked">
                  Pro only
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <span>AI Searches</span>
            </div>
            <div className="flex items-center gap-2">
              {isPro ? (
                <>
                  <span className="text-sm font-medium" data-testid="text-ai-usage">
                    {account?.aiSearchesUsed} / {account?.aiSearchesLimit}
                  </span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${Math.min(((account?.aiSearchesUsed || 0) / (account?.aiSearchesLimit || 200)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <Badge variant="outline" className="text-xs" data-testid="text-ai-locked">
                  Pro only
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Quick Links</h3>
        <div className="space-y-1">
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-2" data-testid="link-settings">
              <Search className="w-4 h-4" />
              Preferences & Notifications
            </Button>
          </Link>
          <Link href="/billing">
            <Button variant="ghost" className="w-full justify-start gap-2" data-testid="link-billing">
              <Crown className="w-4 h-4" />
              Billing & Subscription
            </Button>
          </Link>
          <Link href="/terms">
            <Button variant="ghost" className="w-full justify-start gap-2" data-testid="link-terms">
              <FileText className="w-4 h-4" />
              Terms of Service
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="ghost" className="w-full justify-start gap-2" data-testid="link-privacy">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Button>
          </Link>
        </div>
      </Card>

      <Card className="p-6">
        <a href="/api/logout">
          <Button variant="outline" className="w-full gap-2" data-testid="button-logout">
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </a>
      </Card>
    </div>
  );
}
