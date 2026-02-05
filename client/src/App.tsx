import { useState } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { UpgradeModal } from "@/components/UpgradeModal";
import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/use-auth";
import DailyDropFeed from "@/pages/daily-drop-feed";
import Watchlist from "@/pages/watchlist";
import Builder from "@/pages/builder";
import Portfolio from "@/pages/portfolio";
import Pricing from "@/pages/pricing";
import Landing from "@/pages/landing";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminDomains from "@/pages/admin/domains";
import AdminUsers from "@/pages/admin/users";
import AdminSettings from "@/pages/admin/settings";

function Router({ searchQuery }: { searchQuery: string }) {
  return (
    <Switch>
      <Route path="/">
        <DailyDropFeed searchQuery={searchQuery} />
      </Route>
      <Route path="/watchlist" component={Watchlist} />
      <Route path="/builder" component={Builder} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/pricing" component={Pricing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp({ searchQuery, setSearchQuery }: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
}) {
  const { showUpgradeModal, setShowUpgradeModal, upgradeReason, user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        user={user}
      />
      <main className="container mx-auto px-4 py-6">
        <Router searchQuery={searchQuery} />
      </main>
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        triggerReason={upgradeReason}
      />
    </div>
  );
}

function PublicPricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingHeader />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-6">
          <Pricing />
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

function AppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location === "/pricing") {
      return (
        <UserProvider authUser={null}>
          <PublicPricingPage />
        </UserProvider>
      );
    }
    if (location === "/privacy") {
      return (
        <UserProvider authUser={null}>
          <Privacy />
        </UserProvider>
      );
    }
    if (location === "/terms") {
      return (
        <UserProvider authUser={null}>
          <Terms />
        </UserProvider>
      );
    }
    if (location === "/about") {
      return (
        <UserProvider authUser={null}>
          <About />
        </UserProvider>
      );
    }
    if (location.startsWith("/admin")) {
      return (
        <UserProvider authUser={null}>
          <Redirect to="/" />
        </UserProvider>
      );
    }
    return (
      <UserProvider authUser={null}>
        <Landing />
      </UserProvider>
    );
  }

  if (location.startsWith("/admin")) {
    const isAdmin = (user as any)?.isAdmin === true;
    if (!isAdmin) {
      return (
        <UserProvider authUser={user}>
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">Access Denied</h1>
              <p className="text-muted-foreground">You don't have admin privileges.</p>
              <a href="/" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Go Home
              </a>
            </div>
          </div>
        </UserProvider>
      );
    }
    return (
      <UserProvider authUser={user}>
        <AdminLayout>
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/domains" component={AdminDomains} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route><Redirect to="/admin" /></Route>
          </Switch>
        </AdminLayout>
      </UserProvider>
    );
  }

  return (
    <UserProvider authUser={user}>
      <AuthenticatedApp searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </UserProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
