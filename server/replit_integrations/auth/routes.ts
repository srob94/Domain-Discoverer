import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { onboardingPreferencesSchema } from "@shared/schema";
import { sendEmail } from "../../emailService";

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
