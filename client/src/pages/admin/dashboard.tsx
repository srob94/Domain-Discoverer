import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Crown, 
  Globe, 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  MessageSquare
} from "lucide-react";
import type { AdminStats } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"]
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <Badge variant="outline" className="gap-1">
          <Activity className="w-3 h-3" />
          Live
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card data-testid="card-stat-users">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-pro">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Pro Subscribers</CardTitle>
            <Crown className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.proUsers || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.trialUsers || 0} in trial</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-domains">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Domains Today</CardTitle>
            <Globe className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.domainsToday || 0}</div>
            <p className="text-xs text-muted-foreground">Imported this session</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-alerts">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Alerts Sent</CardTitle>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.alertsSentToday || 0}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-ai-search">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">AI Searches</CardTitle>
            <MessageSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversationSearch?.queriesThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.conversationSearch?.uniqueUsers || 0} users this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pipeline Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Drop Ingest</p>
                  <p className="text-xs text-muted-foreground">
                    Last run: {stats?.lastIngestTime 
                      ? formatDistanceToNow(new Date(stats.lastIngestTime), { addSuffix: true })
                      : 'Never'}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Success
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Domains Processed</p>
                  <p className="text-xs text-muted-foreground">{stats?.domainsToday || 0} domains</p>
                </div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {(stats?.failedEmails || 0) > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <p className="font-medium text-sm">Email Delivery</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.failedEmails || 0} failures today
                  </p>
                </div>
              </div>
              <Badge variant={(stats?.failedEmails || 0) > 0 ? "destructive" : "secondary"}>
                {(stats?.failedEmails || 0) > 0 ? "Issues" : "Healthy"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Recurring Revenue</span>
              <span className="font-bold">${(stats?.proUsers || 0) * 79}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <span className="font-bold">
                {stats?.totalUsers ? ((stats.proUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trial Conversion</span>
              <span className="font-bold">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Watchlist Size</span>
              <span className="font-bold">4.2</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
