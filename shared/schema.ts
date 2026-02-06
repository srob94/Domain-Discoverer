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

// Conversation Search types
export interface ConversationSearchResult {
  filters: {
    keywords: string[];
    tlds: string[];
    minScore: number | null;
    maxScore: number | null;
    maxRenewalPrice: number | null;
    status: "dropping" | "expiring" | "all" | null;
    timeWindowHours: number | null;
    trending: boolean | null;
    queryType: "search" | "explain" | "similar" | "create_alert";
    targetDomain: string | null;
    explanation: string;
  };
  domains: Domain[];
  explanation?: string;
  suggestedSavedSearch?: InsertSavedSearch;
}

export interface ConversationSearchUsage {
  userId: string;
  month: string; // "2026-02"
  count: number;
  limit: number;
}

// Onboarding types
export const onboardingPreferencesSchema = z.object({
  preferredTlds: z.array(z.string()).min(1),
  investorStyle: z.enum(["brandable", "keyword", "short", "ai_startup"]),
  renewalSensitivity: z.number().min(0).max(500),
});

export type OnboardingPreferences = z.infer<typeof onboardingPreferencesSchema>;

// Profile update schema
export const updateProfileSchema = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
}).refine(data => data.firstName !== undefined || data.lastName !== undefined, {
  message: "At least one field must be provided",
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// Notification settings schema
export const notificationSettingsSchema = z.object({
  dropAlertsEnabled: z.boolean(),
  searchAlertsEnabled: z.boolean(),
  weeklyDigestEnabled: z.boolean(),
  notifyWindowHours: z.number().refine(v => [3, 12, 24].includes(v)),
});

export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;

// Newsletter types
export const newsletterSubscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().max(50).optional(),
});

export type NewsletterSubscribeRequest = z.infer<typeof newsletterSubscribeSchema>;

export const newsletterUnsubscribeSchema = z.object({
  email: z.string().email(),
});

// Admin types
export interface AdminStats {
  totalUsers: number;
  proUsers: number;
  trialUsers: number;
  domainsToday: number;
  alertsSentToday: number;
  failedEmails: number;
  lastIngestTime: string | null;
  conversationSearch: {
    totalQueries: number;
    uniqueUsers: number;
    queriesThisMonth: number;
  };
}

export interface AdminUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isPro: boolean;
  isAdmin: boolean;
  watchlistCount: number;
  savedSearchCount: number;
  createdAt: string | null;
  lastActiveAt: string | null;
}

export interface AdminDomain extends Domain {
  isHidden: boolean;
  isFlagged: boolean;
  isFeatured: boolean;
}

export interface AdminSettings {
  enabledTlds: string[];
  blockedTlds: string[];
  premiumRenewalThreshold: number;
  featureFlags: {
    aiBuilder: boolean;
    trendBadges: boolean;
    investorInterest: boolean;
  };
}
