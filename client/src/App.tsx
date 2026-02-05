import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import DailyDropFeed from "@/pages/daily-drop-feed";
import Watchlist from "@/pages/watchlist";
import Builder from "@/pages/builder";
import Portfolio from "@/pages/portfolio";
import NotFound from "@/pages/not-found";

function Router({ searchQuery }: { searchQuery: string }) {
  return (
    <Switch>
      <Route path="/">
        <DailyDropFeed searchQuery={searchQuery} />
      </Route>
      <Route path="/watchlist" component={Watchlist} />
      <Route path="/builder" component={Builder} />
      <Route path="/portfolio" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <main className="container mx-auto px-4 py-6">
            <Router searchQuery={searchQuery} />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
