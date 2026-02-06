import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import type { OnboardingPreferences } from "@shared/schema";

// Interface for auth storage operations
// (IMPORTANT) These user operations are mandatory for Replit Auth.
export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateOnboardingPreferences(id: string, prefs: OnboardingPreferences): Promise<User | undefined>;
  completeOnboarding(id: string): Promise<User | undefined>;
  markWelcomeEmailSent(id: string): Promise<void>;
  markActivationNudgeSent(id: string): Promise<void>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateOnboardingPreferences(id: string, prefs: OnboardingPreferences): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        preferredTlds: prefs.preferredTlds,
        investorStyle: prefs.investorStyle,
        renewalSensitivity: prefs.renewalSensitivity,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async completeOnboarding(id: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async markWelcomeEmailSent(id: string): Promise<void> {
    await db
      .update(users)
      .set({ welcomeEmailSent: true })
      .where(eq(users.id, id));
  }

  async markActivationNudgeSent(id: string): Promise<void> {
    await db
      .update(users)
      .set({ activationNudgeSent: true })
      .where(eq(users.id, id));
  }
}

export const authStorage = new AuthStorage();
