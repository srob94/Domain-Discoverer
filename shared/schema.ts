import { z } from "zod";

export * from "./models/auth";

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

// Portfolio item for owned domains
export interface PortfolioItem {
  id: string;
  domain: string;
  purchasePrice: number;
  renewalDate: string | null;
  renewalCost: number;
  addedAt: string;
}

export const insertPortfolioItemSchema = z.object({
  domain: z.string().min(1),
  purchasePrice: z.number().min(0).default(0),
  renewalDate: z.string().nullable().default(null),
  renewalCost: z.number().min(0).default(0),
});

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;

// AI Generated domain
export interface GeneratedDomain {
  fqdn: string;
  score: number;
  reason: string;
  tld: string;
}

export const generateDomainsRequestSchema = z.object({
  keyword: z.string().min(1).max(100),
  count: z.number().min(1).max(50).default(30),
});

export const explainScoreRequestSchema = z.object({
  domain: z.string().min(1),
  score: z.number().min(0).max(100),
});

// Notification types
export const notificationTypeEnum = z.enum(["drop_soon", "search_match", "premium_warning", "upgrade_signal"]);
export type NotificationType = z.infer<typeof notificationTypeEnum>;

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  domainId: string | null;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
}

export const insertNotificationSchema = z.object({
  type: notificationTypeEnum,
  title: z.string().min(1),
  message: z.string().min(1),
  domainId: z.string().nullable().optional(),
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Email types for transactional emails
export const emailTypeEnum = z.enum([
  "welcome",
  "activation_nudge",
  "watchlist_confirmation",
  "watchlist_limit_upgrade",
  "saved_search_locked",
  "trial_start",
  "drop_alert",
  "search_match_alert",
  "premium_renewal_warning",
  "investor_interest",
  "trial_ending",
  "conversion",
  "churn_save",
  "weekly_digest"
]);

export type EmailType = z.infer<typeof emailTypeEnum>;

// Email send request schema
export const sendEmailRequestSchema = z.object({
  type: emailTypeEnum,
  to: z.string().email(),
  variables: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

export type SendEmailRequest = z.infer<typeof sendEmailRequestSchema>;

// Email log for tracking sent emails
export interface EmailLog {
  id: string;
  userId: string;
  type: EmailType;
  to: string;
  subject: string;
  sentAt: string;
  status: "sent" | "failed" | "mock";
}
