import { randomUUID } from "crypto";
import type { 
  Domain, 
  DomainStatus, 
  WatchlistItem, 
  SavedSearch, 
  InsertSavedSearch 
} from "@shared/schema";

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

  constructor() {
    this.domains = new Map();
    this.watchlist = new Map();
    this.savedSearches = new Map();

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
}

export const storage = new MemStorage();
