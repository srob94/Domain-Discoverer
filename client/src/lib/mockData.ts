import type { Domain, SavedSearch, WatchlistItem } from "@shared/schema";

export const mockDomains: Domain[] = [
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

export const mockSavedSearches: SavedSearch[] = [
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
  },
  {
    id: "3",
    name: "Premium .com",
    keywords: [],
    tlds: [".com"],
    status: "all",
    minScore: 90,
    maxRenewalCost: 100,
    alertsEnabled: true,
    matchCount: 3,
    createdAt: new Date().toISOString()
  }
];

export const mockWatchlist: WatchlistItem[] = [
  {
    id: "w1",
    domain: mockDomains[0],
    addedAt: new Date().toISOString()
  },
  {
    id: "w2",
    domain: mockDomains[2],
    addedAt: new Date().toISOString()
  },
  {
    id: "w3",
    domain: mockDomains[5],
    addedAt: new Date().toISOString()
  }
];

export const tldOptions = [
  { value: "all", label: "All TLDs" },
  { value: ".com", label: ".com" },
  { value: ".io", label: ".io" },
  { value: ".net", label: ".net" },
  { value: ".co", label: ".co" },
  { value: ".dev", label: ".dev" },
  { value: ".ai", label: ".ai" },
  { value: ".app", label: ".app" }
];

export const scoreOptions = [
  { value: 0, label: "Any Score" },
  { value: 50, label: "50+" },
  { value: 60, label: "60+" },
  { value: 70, label: "70+" },
  { value: 75, label: "75+" },
  { value: 80, label: "80+" },
  { value: 85, label: "85+" },
  { value: 90, label: "90+" }
];
