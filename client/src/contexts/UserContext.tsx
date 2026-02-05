import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { User as AuthUser } from "@shared/schema";

type UserPlan = "visitor" | "starter" | "pro";

interface UserContextType {
  user: AuthUser | null;
  plan: UserPlan;
  isLoggedIn: boolean;
  isPro: boolean;
  upgradeToPro: () => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  upgradeReason: string;
  triggerUpgrade: (reason: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  authUser?: AuthUser | null;
}

export function UserProvider({ children, authUser }: UserProviderProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");
  const [manualPro, setManualPro] = useState(false);

  const isLoggedIn = authUser !== null && authUser !== undefined;
  const plan: UserPlan = manualPro ? "pro" : (isLoggedIn ? "starter" : "visitor");
  const isPro = plan === "pro";

  const upgradeToPro = useCallback(() => {
    setManualPro(true);
  }, []);

  const triggerUpgrade = useCallback((reason: string) => {
    setUpgradeReason(reason);
    setShowUpgradeModal(true);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: authUser || null,
        plan,
        isLoggedIn,
        isPro,
        upgradeToPro,
        showUpgradeModal,
        setShowUpgradeModal,
        upgradeReason,
        triggerUpgrade,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
