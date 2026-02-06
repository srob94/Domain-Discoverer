import { sql } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  isPro: boolean("is_pro").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  preferredTlds: text("preferred_tlds").array(),
  investorStyle: varchar("investor_style"),
  renewalSensitivity: integer("renewal_sensitivity"),
  welcomeEmailSent: boolean("welcome_email_sent").default(false),
  activationNudgeSent: boolean("activation_nudge_sent").default(false),
  dropAlertsEnabled: boolean("drop_alerts_enabled").default(true),
  searchAlertsEnabled: boolean("search_alerts_enabled").default(false),
  weeklyDigestEnabled: boolean("weekly_digest_enabled").default(false),
  notifyWindowHours: integer("notify_window_hours").default(12),
  trialEndsAt: timestamp("trial_ends_at"),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
