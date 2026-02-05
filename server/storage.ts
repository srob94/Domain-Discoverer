import { randomUUID } from "crypto";
import type { 
  Domain, 
  DomainStatus, 
  WatchlistItem, 
  SavedSearch, 
  InsertSavedSearch,
  PortfolioItem,
  InsertPortfolioItem,
  Notification,
  InsertNotification,
  AdminStats,
  AdminDomain,
  AdminUser,
  AdminSettings,
  ConversationSearchUsage
} from "@shared/schema";
import { getEmailLogs } from "./emailService";

export interface IStorage {
  getDomains(): Promise<Domain[]>;
  getDomainById(id: string): Promise<Domain | undefined>;
  
  getWatchlist(): Promise<WatchlistItem[]>;
  addToWatchlist(domainId: string): Promise<WatchlistItem | undefined>;
  removeFromWatchlist(id: string): Promise<boolean>;
  
  getSavedSearches(): Promise<SavedSearch[]>;
  createSavedSearch(search: InsertSavedSearch): Promise<SavedSearch>;
  updateSavedSearchAlerts(id: string, alertsEnabled: boolean): Promise<SavedSearch | undefined>;
  deleteSavedSearch(id: string): Promise<boolean>;
  
  getPortfolio(): Promise<PortfolioItem[]>;
  addToPortfolio(item: InsertPortfolioItem): Promise<PortfolioItem>;
  removeFromPortfolio(id: string): Promise<boolean>;
  
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(userId: string, notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string, userId: string): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  
  getAdminStats(): Promise<AdminStats>;
  getAdminDomains(): Promise<AdminDomain[]>;
  updateAdminDomain(id: string, update: Partial<AdminDomain>): Promise<AdminDomain | undefined>;
  getAdminUsers(search: string): Promise<AdminUser[]>;
  updateAdminUser(id: string, update: { isPro?: boolean; isAdmin?: boolean; isDisabled?: boolean }): Promise<AdminUser | undefined>;
  getAdminSettings(): Promise<AdminSettings>;
  updateAdminSettings(settings: Partial<AdminSettings>): Promise<AdminSettings>;
  getAdminAlertLogs(): Promise<any[]>;
  
  getConversationSearchUsage(userId: string): Promise<ConversationSearchUsage>;
  incrementConversationSearchUsage(userId: string): Promise<ConversationSearchUsage>;
  getConversationSearchStats(): Promise<{ totalQueries: number; uniqueUsers: number; queriesThisMonth: number }>;
}

const mockDomains: Domain[] = [
  {
    id: "1",
    fqdn: "cryptoflow.com",
    score: 92,
    status: "dropping",
    dropsIn: "12h",
    renewalPrice: 12.99,
    premiumRenewal: false,
    trending: true,
    tld: ".com"
  },
  {
    id: "2",
    fqdn: "aiventure.com",
    score: 88,
    status: "dropping",
    dropsIn: "6h",
    renewalPrice: 89.99,
    premiumRenewal: true,
    trending: true,
    tld: ".com"
  },
  {
    id: "3",
    fqdn: "metaverse.io",
    score: 85,
    status: "expiring",
    dropsIn: "2d",
    renewalPrice: 45.00,
    premiumRenewal: true,
    trending: false,
    tld: ".io"
  },
  {
    id: "4",
    fqdn: "blockstack.net",
    score: 81,
    status: "dropping",
    dropsIn: "18h",
    renewalPrice: 14.99,
    premiumRenewal: false,
    trending: false,
    tld: ".net"
  },
  {
    id: "5",
    fqdn: "cloudhub.com",
    score: 79,
    status: "expiring",
    dropsIn: "4d",
    renewalPrice: 12.99,
    premiumRenewal: false,
    trending: true,
    tld: ".com"
  },
  {
    id: "6",
    fqdn: "nftmarket.io",
    score: 77,
    status: "dropping",
    dropsIn: "8h",
    renewalPrice: 120.00,
    premiumRenewal: true,
    trending: true,
    tld: ".io"
  },
  {
    id: "7",
    fqdn: "dataforge.com",
    score: 76,
    status: "dropping",
    dropsIn: "1d",
    renewalPrice: 12.99,
    premiumRenewal: false,
    trending: false,
    tld: ".com"
  },
  {
    id: "8",
    fqdn: "quantumai.net",
    score: 75,
    status: "expiring",
    dropsIn: "3d",
    renewalPrice: 14.99,
    premiumRenewal: false,
    trending: false,
    tld: ".net"
  },
  {
    id: "9",
    fqdn: "webflow.dev",
    score: 83,
    status: "dropping",
    dropsIn: "5h",
    renewalPrice: 18.00,
    premiumRenewal: false,
    trending: true,
    tld: ".dev"
  },
  {
    id: "10",
    fqdn: "starlink.co",
    score: 90,
    status: "dropping",
    dropsIn: "2h",
    renewalPrice: 250.00,
    premiumRenewal: true,
    trending: true,
    tld: ".co"
  }
];

export class MemStorage implements IStorage {
  private domains: Map<string, Domain>;
  private watchlist: Map<string, WatchlistItem>;
  private savedSearches: Map<string, SavedSearch>;
  private portfolio: Map<string, PortfolioItem>;
  private notifications: Map<string, Notification>;
  private adminDomainState: Map<string, { isHidden: boolean; isFlagged: boolean; isFeatured: boolean }>;
  private adminSettings: AdminSettings;
  private conversationSearchUsage: Map<string, ConversationSearchUsage>;

  constructor() {
    this.domains = new Map();
    this.watchlist = new Map();
    this.savedSearches = new Map();
    this.portfolio = new Map();
    this.notifications = new Map();
    this.adminDomainState = new Map();
    this.conversationSearchUsage = new Map();
    this.adminSettings = {
      enabledTlds: [".com", ".io", ".net", ".dev", ".co"],
      blockedTlds: [".xyz", ".top", ".info"],
      premiumRenewalThreshold: 100,
      featureFlags: {
        aiBuilder: true,
        trendBadges: true,
        investorInterest: true
      }
    };

    mockDomains.forEach((domain) => {
      this.domains.set(domain.id, domain);
    });

    const initialSearches: SavedSearch[] = [
      {
        id: "1",
        name: "Tech Startups",
        keywords: ["tech", "ai", "cloud"],
        tlds: [".com", ".io"],
        status: "all",
        minScore: 80,
        maxRenewalCost: 50,
        alertsEnabled: true,
        matchCount: 12,
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Crypto Domains",
        keywords: ["crypto", "nft", "block"],
        tlds: [".com", ".io", ".net"],
        status: "dropping",
        minScore: 75,
        maxRenewalCost: null,
        alertsEnabled: false,
        matchCount: 8,
        createdAt: new Date().toISOString()
      }
    ];

    initialSearches.forEach((search) => {
      this.savedSearches.set(search.id, search);
    });

    this.seedDemoNotifications();
  }

  private seedDemoNotifications() {
    const demoUserId = "demo-user";
    const now = new Date();
    
    const demoNotifications: Notification[] = [
      {
        id: "notif-1",
        userId: demoUserId,
        type: "drop_soon",
        domainId: "10",
        title: "Domain dropping soon",
        message: "starlink.co drops in 2 hours",
        createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
        readAt: null
      },
      {
        id: "notif-2",
        userId: demoUserId,
        type: "premium_warning",
        domainId: "2",
        title: "Premium renewal warning",
        message: "aiventure.com renewal is $89.99/yr",
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
        readAt: null
      },
      {
        id: "notif-3",
        userId: demoUserId,
        type: "search_match",
        domainId: null,
        title: "New matches found",
        message: "5 new domains match 'AI .com score > 80'",
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(),
        readAt: null
      },
      {
        id: "notif-4",
        userId: demoUserId,
        type: "drop_soon",
        domainId: "9",
        title: "Domain dropping soon",
        message: "webflow.dev drops in 5 hours",
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 6).toISOString(),
        readAt: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString()
      }
    ];

    demoNotifications.forEach(n => this.notifications.set(n.id, n));
  }

  seedUserNotifications(userId: string) {
    const now = new Date();
    
    const userNotifications: Notification[] = [
      {
        id: randomUUID(),
        userId,
        type: "drop_soon",
        domainId: "10",
        title: "Domain dropping soon",
        message: "starlink.co drops in 2 hours",
        createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
        readAt: null
      },
      {
        id: randomUUID(),
        userId,
        type: "premium_warning",
        domainId: "2",
        title: "Premium renewal warning",
        message: "aiventure.com renewal is $89.99/yr",
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
        readAt: null
      },
      {
        id: randomUUID(),
        userId,
        type: "search_match",
        domainId: null,
        title: "New matches found",
        message: "5 new domains match 'AI .com score > 80'",
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(),
        readAt: null
      }
    ];

    userNotifications.forEach(n => this.notifications.set(n.id, n));
  }

  async getDomains(): Promise<Domain[]> {
    return Array.from(this.domains.values());
  }

  async getDomainById(id: string): Promise<Domain | undefined> {
    return this.domains.get(id);
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    return Array.from(this.watchlist.values());
  }

  async addToWatchlist(domainId: string): Promise<WatchlistItem | undefined> {
    const domain = this.domains.get(domainId);
    if (!domain) return undefined;

    const existingItem = Array.from(this.watchlist.values()).find(
      (item) => item.domain.id === domainId
    );
    if (existingItem) return existingItem;

    const item: WatchlistItem = {
      id: randomUUID(),
      domain,
      addedAt: new Date().toISOString()
    };
    this.watchlist.set(item.id, item);
    return item;
  }

  async removeFromWatchlist(id: string): Promise<boolean> {
    return this.watchlist.delete(id);
  }

  async getSavedSearches(): Promise<SavedSearch[]> {
    return Array.from(this.savedSearches.values());
  }

  async createSavedSearch(search: InsertSavedSearch): Promise<SavedSearch> {
    const newSearch: SavedSearch = {
      ...search,
      id: randomUUID(),
      matchCount: Math.floor(Math.random() * 20) + 1,
      createdAt: new Date().toISOString()
    };
    this.savedSearches.set(newSearch.id, newSearch);
    return newSearch;
  }

  async updateSavedSearchAlerts(id: string, alertsEnabled: boolean): Promise<SavedSearch | undefined> {
    const search = this.savedSearches.get(id);
    if (!search) return undefined;

    const updated = { ...search, alertsEnabled };
    this.savedSearches.set(id, updated);
    return updated;
  }

  async deleteSavedSearch(id: string): Promise<boolean> {
    return this.savedSearches.delete(id);
  }

  async getPortfolio(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolio.values());
  }

  async addToPortfolio(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const portfolioItem: PortfolioItem = {
      ...item,
      id: randomUUID(),
      addedAt: new Date().toISOString()
    };
    this.portfolio.set(portfolioItem.id, portfolioItem);
    return portfolioItem;
  }

  async removeFromPortfolio(id: string): Promise<boolean> {
    return this.portfolio.delete(id);
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(n => n.userId === userId);
    
    if (userNotifications.length === 0 && userId !== "demo-user") {
      this.seedUserNotifications(userId);
      return Array.from(this.notifications.values())
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(userId: string, notification: InsertNotification): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: randomUUID(),
      userId,
      domainId: notification.domainId || null,
      createdAt: new Date().toISOString(),
      readAt: null
    };
    this.notifications.set(newNotification.id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: string, userId: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification || notification.userId !== userId) return undefined;

    const updated = { ...notification, readAt: new Date().toISOString() };
    this.notifications.set(id, updated);
    return updated;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const now = new Date().toISOString();
    Array.from(this.notifications.entries()).forEach(([id, notification]) => {
      if (notification.userId === userId && !notification.readAt) {
        this.notifications.set(id, { ...notification, readAt: now });
      }
    });
  }

  async getAdminStats(): Promise<AdminStats> {
    const domains = Array.from(this.domains.values());
    const allLogs = getEmailLogs();
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = allLogs.filter(log => log.sentAt.startsWith(today));
    
    return {
      totalUsers: 42,
      proUsers: 8,
      trialUsers: 5,
      domainsToday: domains.length,
      alertsSentToday: todayLogs.filter(l => l.type.includes('alert')).length,
      failedEmails: todayLogs.filter(l => l.status === 'failed').length,
      lastIngestTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    };
  }

  async getAdminDomains(): Promise<AdminDomain[]> {
    const domains = Array.from(this.domains.values());
    return domains.map(d => ({
      ...d,
      isHidden: this.adminDomainState.get(d.id)?.isHidden || false,
      isFlagged: this.adminDomainState.get(d.id)?.isFlagged || false,
      isFeatured: this.adminDomainState.get(d.id)?.isFeatured || false
    }));
  }

  async updateAdminDomain(id: string, update: Partial<AdminDomain>): Promise<AdminDomain | undefined> {
    const domain = this.domains.get(id);
    if (!domain) return undefined;
    
    const currentState = this.adminDomainState.get(id) || { isHidden: false, isFlagged: false, isFeatured: false };
    const newState = { ...currentState, ...update };
    this.adminDomainState.set(id, newState);
    
    if (update.score !== undefined) {
      this.domains.set(id, { ...domain, score: update.score });
    }
    
    return {
      ...this.domains.get(id)!,
      ...newState
    };
  }

  async getAdminUsers(search: string): Promise<AdminUser[]> {
    const mockUsers: AdminUser[] = [
      { id: "1", email: "john@example.com", firstName: "John", lastName: "Doe", isPro: true, isAdmin: false, watchlistCount: 8, savedSearchCount: 3, createdAt: "2024-01-15", lastActiveAt: "2024-02-04" },
      { id: "2", email: "jane@example.com", firstName: "Jane", lastName: "Smith", isPro: false, isAdmin: false, watchlistCount: 5, savedSearchCount: 1, createdAt: "2024-02-01", lastActiveAt: "2024-02-05" },
      { id: "3", email: "admin@tldterminal.com", firstName: "Admin", lastName: "User", isPro: true, isAdmin: true, watchlistCount: 0, savedSearchCount: 0, createdAt: "2024-01-01", lastActiveAt: "2024-02-05" },
      { id: "4", email: "trial@example.com", firstName: "Trial", lastName: "User", isPro: false, isAdmin: false, watchlistCount: 2, savedSearchCount: 0, createdAt: "2024-02-03", lastActiveAt: "2024-02-05" },
    ];
    
    if (!search) return mockUsers;
    const searchLower = search.toLowerCase();
    return mockUsers.filter(u => 
      u.email?.toLowerCase().includes(searchLower) ||
      u.firstName?.toLowerCase().includes(searchLower) ||
      u.lastName?.toLowerCase().includes(searchLower)
    );
  }

  async updateAdminUser(id: string, update: { isPro?: boolean; isAdmin?: boolean; isDisabled?: boolean }): Promise<AdminUser | undefined> {
    return { id, email: "user@example.com", firstName: "Updated", lastName: "User", isPro: update.isPro ?? false, isAdmin: update.isAdmin ?? false, watchlistCount: 0, savedSearchCount: 0, createdAt: "2024-01-01", lastActiveAt: "2024-02-05" };
  }

  async getAdminSettings(): Promise<AdminSettings> {
    return this.adminSettings;
  }

  async updateAdminSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
    this.adminSettings = { ...this.adminSettings, ...settings };
    return this.adminSettings;
  }

  async getAdminAlertLogs(): Promise<any[]> {
    const allLogs = getEmailLogs();
    return allLogs.slice(0, 50);
  }

  async getConversationSearchUsage(userId: string): Promise<ConversationSearchUsage> {
    const month = new Date().toISOString().slice(0, 7);
    const key = `${userId}-${month}`;
    const existing = this.conversationSearchUsage.get(key);
    if (existing) return existing;
    
    const usage: ConversationSearchUsage = {
      userId,
      month,
      count: 0,
      limit: 200
    };
    this.conversationSearchUsage.set(key, usage);
    return usage;
  }

  async incrementConversationSearchUsage(userId: string): Promise<ConversationSearchUsage> {
    const month = new Date().toISOString().slice(0, 7);
    const key = `${userId}-${month}`;
    const existing = await this.getConversationSearchUsage(userId);
    const updated = { ...existing, count: existing.count + 1 };
    this.conversationSearchUsage.set(key, updated);
    return updated;
  }

  async getConversationSearchStats(): Promise<{ totalQueries: number; uniqueUsers: number; queriesThisMonth: number }> {
    const month = new Date().toISOString().slice(0, 7);
    const allUsage = Array.from(this.conversationSearchUsage.values());
    const thisMonthUsage = allUsage.filter(u => u.month === month);
    
    return {
      totalQueries: allUsage.reduce((sum, u) => sum + u.count, 0),
      uniqueUsers: new Set(allUsage.map(u => u.userId)).size,
      queriesThisMonth: thisMonthUsage.reduce((sum, u) => sum + u.count, 0)
    };
  }
}

export const storage = new MemStorage();
