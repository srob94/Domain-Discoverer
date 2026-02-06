import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Check, Globe, Target, DollarSign } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PreferenceStepperProps {
  open: boolean;
  onComplete: () => void;
}

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
  { value: 30, label: "Under $30/year", tag: "recommended" },
  { value: 100, label: "Under $100/year", tag: null },
  { value: 500, label: "Show all", tag: null },
];

export function PreferenceStepper({ open, onComplete }: PreferenceStepperProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedTlds, setSelectedTlds] = useState<string[]>([".com"]);
  const [investorStyle, setInvestorStyle] = useState<string>("brandable");
  const [renewalSensitivity, setRenewalSensitivity] = useState<number>(30);

  const savePreferencesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/onboarding/preferences", {
        preferredTlds: selectedTlds,
        investorStyle,
        renewalSensitivity,
      });
      await apiRequest("POST", "/api/onboarding/complete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Could not save preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleTld = (tld: string) => {
    setSelectedTlds(prev =>
      prev.includes(tld)
        ? prev.filter(t => t !== tld)
        : [...prev, tld]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      savePreferencesMutation.mutate();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = step === 1 ? selectedTlds.length > 0 : true;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3 mb-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
                data-testid={`stepper-progress-${s}`}
              />
            ))}
          </div>
          <DialogTitle className="text-lg font-semibold">
            {step === 1 && "Preferred Extensions"}
            {step === 2 && "Investor Style"}
            {step === 3 && "Renewal Sensitivity"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 min-h-[200px]">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Which domain extensions are you most interested in?
              </p>
              <div className="flex flex-wrap gap-2">
                {TLD_OPTIONS.map(tld => (
                  <Badge
                    key={tld.value}
                    variant={selectedTlds.includes(tld.value) ? "default" : "outline"}
                    className={`cursor-pointer text-sm px-3 py-1.5 toggle-elevate ${selectedTlds.includes(tld.value) ? "toggle-elevated" : ""}`}
                    onClick={() => toggleTld(tld.value)}
                    data-testid={`tld-option-${tld.value}`}
                  >
                    <Globe className="w-3 h-3 mr-1.5" />
                    {tld.label}
                  </Badge>
                ))}
              </div>
              {selectedTlds.length === 0 && (
                <p className="text-xs text-destructive">Select at least one extension</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                What type of domains are you looking for?
              </p>
              <div className="space-y-2">
                {INVESTOR_STYLES.map(style => (
                  <button
                    key={style.value}
                    onClick={() => setInvestorStyle(style.value)}
                    className={`w-full text-left p-3 rounded-md border transition-colors ${
                      investorStyle === style.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover-elevate"
                    }`}
                    data-testid={`style-option-${style.value}`}
                  >
                    <div className="flex items-center gap-3">
                      <Target className={`w-4 h-4 ${investorStyle === style.value ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{style.label}</p>
                        <p className="text-xs text-muted-foreground">{style.description}</p>
                      </div>
                      {investorStyle === style.value && (
                        <Check className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                What's your maximum acceptable renewal cost?
              </p>
              <Select
                value={String(renewalSensitivity)}
                onValueChange={(val) => setRenewalSensitivity(Number(val))}
              >
                <SelectTrigger data-testid="select-renewal-sensitivity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RENEWAL_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3" />
                        {option.label}
                        {option.tag && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {option.tag}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Domains above this renewal cost will be flagged as premium renewals.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className={step === 1 ? "invisible" : ""}
            data-testid="button-stepper-back"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed || savePreferencesMutation.isPending}
            data-testid="button-stepper-next"
          >
            {savePreferencesMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </>
            ) : step === 3 ? (
              <>
                Generate My Feed
                <Check className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
