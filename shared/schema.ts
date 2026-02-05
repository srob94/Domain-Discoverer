import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Domain status types
export type DomainStatus = "dropping" | "expiring";

// Domain interface for mock/API data
export interface Domain {
  id: string;
  fqdn: string;
  score: number;
  status: DomainStatus;
  dropsIn: string;
  renewalPrice: number;
  premiumRenewal: boolean;
  trending: boolean;
  tld: string;
}

// Watchlist item
export interface WatchlistItem {
  id: string;
  domain: Domain;
  addedAt: string;
}

// Saved search configuration
export interface SavedSearch {
  id: string;
  name: string;
  keywords: string[];
  tlds: string[];
  status: DomainStatus | "all";
  minScore: number;
  maxRenewalCost: number | null;
  alertsEnabled: boolean;
  matchCount: number;
  createdAt: string;
}

// Insert types for API
export interface InsertWatchlistItem {
  domainId: string;
}

export interface InsertSavedSearch {
  name: string;
  keywords: string[];
  tlds: string[];
  status: DomainStatus | "all";
  minScore: number;
  maxRenewalCost: number | null;
  alertsEnabled: boolean;
}

// Filter state for Daily Drop Feed
export interface DomainFilters {
  tld: string;
  minScore: number;
  premiumOnly: boolean;
  searchQuery: string;
}
