import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { onboardingPreferencesSchema, updateProfileSchema, notificationSettingsSchema } from "@shared/schema";
import { sendEmail } from "../../emailService";
import { storage } from "../../storage";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);

      if (user && !user.welcomeEmailSent && user.email) {
        sendEmail(user.id, "welcome", user.email, {
          first_name: user.firstName || "there",
        }).catch(console.error);
        authStorage.markWelcomeEmailSent(user.id).catch(console.error);

        scheduleActivationNudge(user.id, user.email, user.firstName || "there");
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/onboarding/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        onboardingCompleted: user.onboardingCompleted,
        preferredTlds: user.preferredTlds,
        investorStyle: user.investorStyle,
        renewalSensitivity: user.renewalSensitivity,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post("/api/onboarding/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = onboardingPreferencesSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const user = await authStorage.updateOnboardingPreferences(userId, parsed.data);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to save preferences" });
    }
  });

  app.post("/api/onboarding/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.completeOnboarding(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  app.get("/api/account", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const conversationUsage = await storage.getConversationSearchUsage(userId);

      const allWatchlist = await storage.getWatchlist();
      const allSearches = await storage.getSavedSearches();

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        isPro: user.isPro,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        watchlistCount: allWatchlist.length,
        watchlistLimit: user.isPro ? 999 : 10,
        savedSearchCount: allSearches.length,
        aiSearchesUsed: conversationUsage.count,
        aiSearchesLimit: conversationUsage.limit,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch account" });
    }
  });

  app.patch("/api/account", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const user = await authStorage.updateProfile(userId, parsed.data);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get("/api/settings/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        dropAlertsEnabled: user.dropAlertsEnabled ?? true,
        searchAlertsEnabled: user.searchAlertsEnabled ?? false,
        weeklyDigestEnabled: user.weeklyDigestEnabled ?? false,
        notifyWindowHours: user.notifyWindowHours ?? 12,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  app.put("/api/settings/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = notificationSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const user = await authStorage.updateNotificationSettings(userId, parsed.data);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        dropAlertsEnabled: user.dropAlertsEnabled,
        searchAlertsEnabled: user.searchAlertsEnabled,
        weeklyDigestEnabled: user.weeklyDigestEnabled,
        notifyWindowHours: user.notifyWindowHours,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });

  app.get("/api/billing", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const plan = user.isPro ? "pro" : "starter";
      const trialActive = user.trialEndsAt && new Date(user.trialEndsAt) > new Date();

      res.json({
        plan,
        trialActive: trialActive || false,
        trialEndsAt: user.trialEndsAt ? user.trialEndsAt.toISOString() : null,
        nextBillingDate: user.isPro ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        monthlyPrice: 79,
        currency: "USD",
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch billing info" });
    }
  });
}

function scheduleActivationNudge(userId: string, email: string, firstName: string) {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  setTimeout(async () => {
    try {
      const user = await authStorage.getUser(userId);
      if (user && !user.activationNudgeSent) {
        await sendEmail(userId, "activation_nudge", email, {
          first_name: firstName,
        });
        await authStorage.markActivationNudgeSent(userId);
      }
    } catch (error) {
      console.error("Failed to send activation nudge:", error);
    }
  }, TWENTY_FOUR_HOURS);
}
