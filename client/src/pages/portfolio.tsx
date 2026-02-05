import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProFeatureLock } from "@/components/ProFeatureLock";
import { 
  Briefcase, 
  Crown, 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  Lock,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PortfolioItem } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { differenceInDays, format, parseISO } from "date-fns";

export default function Portfolio() {
  const { isPro } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    domain: "",
    purchasePrice: "",
    renewalDate: "",
    renewalCost: "",
  });
  const { toast } = useToast();

  const { data: portfolio = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: {
      domain: string;
      purchasePrice: number;
      renewalDate: string | null;
      renewalCost: number;
    }) => {
      const response = await apiRequest("POST", "/api/portfolio", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsAddDialogOpen(false);
      setFormData({ domain: "", purchasePrice: "", renewalDate: "", renewalCost: "" });
      toast({ title: "Domain Added", description: "Domain added to your portfolio" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add domain", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({ title: "Domain Removed", description: "Domain removed from portfolio" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domain.trim()) return;
    
    addMutation.mutate({
      domain: formData.domain.trim(),
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      renewalDate: formData.renewalDate || null,
      renewalCost: parseFloat(formData.renewalCost) || 0,
    });
  };

  const totalRenewalCost = portfolio.reduce((sum, item) => sum + item.renewalCost, 0);
  const renewalsDueSoon = portfolio.filter(item => {
    if (!item.renewalDate) return false;
    const days = differenceInDays(parseISO(item.renewalDate), new Date());
    return days >= 0 && days <= 30;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary" />
            Portfolio Lite
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your owned domains and renewal costs
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-700 gap-1.5 px-3 py-1.5"
        >
          <Crown className="w-3.5 h-3.5" />
          Pro Feature
        </Badge>
      </div>

      <ProFeatureLock 
        feature="Portfolio Tracking" 
        description="Track your owned domains, renewal costs, and get alerts before expiration."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Renewal Cost</p>
                <p className="text-xl font-bold text-foreground">${totalRenewalCost.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Renewals Due (30 days)</p>
                <p className="text-xl font-bold text-foreground">{renewalsDueSoon.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Domains</p>
                <p className="text-xl font-bold text-foreground">{portfolio.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </ProFeatureLock>

      <Card className="p-6 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Unlock Full Portfolio Features</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade to Pro for automatic domain import from registrars, market value tracking,
              renewal reminders, and drop score analysis for underperforming domains.
            </p>
            <Button variant="default" size="sm" className="gap-1.5" data-testid="button-upgrade-pro">
              <Crown className="w-4 h-4" />
              Upgrade to Pro
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Domains</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-domain" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Domain to Portfolio</DialogTitle>
                <DialogDescription>
                  Track a domain you own with its renewal information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input
                    id="domain"
                    data-testid="input-domain-name"
                    placeholder="example.com"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                    <Input
                      id="purchasePrice"
                      data-testid="input-purchase-price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="renewalCost">Annual Renewal ($)</Label>
                    <Input
                      id="renewalCost"
                      data-testid="input-renewal-cost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.renewalCost}
                      onChange={(e) => setFormData({ ...formData, renewalCost: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renewalDate">Next Renewal Date</Label>
                  <Input
                    id="renewalDate"
                    data-testid="input-renewal-date"
                    type="date"
                    value={formData.renewalDate}
                    onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-submit-domain">
                  {addMutation.isPending ? "Adding..." : "Add Domain"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3" />
            </Card>
          ))}
        </div>
      ) : portfolio.length === 0 ? (
        <Card className="p-8 text-center">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Domains Yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first domain to start tracking your portfolio.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {portfolio.map((item) => {
            const daysUntilRenewal = item.renewalDate 
              ? differenceInDays(parseISO(item.renewalDate), new Date())
              : null;
            const isUrgent = daysUntilRenewal !== null && daysUntilRenewal >= 0 && daysUntilRenewal <= 30;
            
            return (
              <Card 
                key={item.id} 
                data-testid={`portfolio-item-${item.id}`}
                className={`p-4 ${isUrgent ? 'border-amber-300 dark:border-amber-700' : ''}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{item.domain}</span>
                      {isUrgent && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Renews in {daysUntilRenewal} days
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      {item.purchasePrice > 0 && (
                        <span>Bought: ${item.purchasePrice.toFixed(2)}</span>
                      )}
                      {item.renewalCost > 0 && (
                        <span>Renewal: ${item.renewalCost.toFixed(2)}/yr</span>
                      )}
                      {item.renewalDate && (
                        <span>Due: {format(parseISO(item.renewalDate), 'MMM d, yyyy')}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
