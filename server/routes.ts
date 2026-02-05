import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { generateDomainNames, explainDomainScore } from "./ai";
import { 
  insertPortfolioItemSchema, 
  generateDomainsRequestSchema, 
  explainScoreRequestSchema 
} from "@shared/schema";

const insertSavedSearchSchema = z.object({
  name: z.string().min(1),
  keywords: z.array(z.string()),
  tlds: z.array(z.string()).min(1),
  status: z.enum(["dropping", "expiring", "all"]),
  minScore: z.number().min(0).max(100),
  maxRenewalCost: z.number().nullable(),
  alertsEnabled: z.boolean()
});

const updateAlertsSchema = z.object({
  alertsEnabled: z.boolean()
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/domains", async (req, res) => {
    try {
      const domains = await storage.getDomains();
      res.json(domains);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch domains" });
    }
  });

  app.get("/api/domains/:id", async (req, res) => {
    try {
      const domain = await storage.getDomainById(req.params.id);
      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      }
      res.json(domain);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch domain" });
    }
  });

  app.get("/api/watchlist", async (req, res) => {
    try {
      const watchlist = await storage.getWatchlist();
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    try {
      const { domainId } = req.body;
      if (!domainId) {
        return res.status(400).json({ error: "domainId is required" });
      }
      const item = await storage.addToWatchlist(domainId);
      if (!item) {
        return res.status(404).json({ error: "Domain not found" });
      }
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:id", async (req, res) => {
    try {
      const success = await storage.removeFromWatchlist(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Watchlist item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from watchlist" });
    }
  });

  app.get("/api/saved-searches", async (req, res) => {
    try {
      const searches = await storage.getSavedSearches();
      res.json(searches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved searches" });
    }
  });

  app.post("/api/saved-searches", async (req, res) => {
    try {
      const parsed = insertSavedSearchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const search = await storage.createSavedSearch(parsed.data);
      res.status(201).json(search);
    } catch (error) {
      res.status(500).json({ error: "Failed to create saved search" });
    }
  });

  app.patch("/api/saved-searches/:id/alerts", async (req, res) => {
    try {
      const parsed = updateAlertsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const search = await storage.updateSavedSearchAlerts(req.params.id, parsed.data.alertsEnabled);
      if (!search) {
        return res.status(404).json({ error: "Saved search not found" });
      }
      res.json(search);
    } catch (error) {
      res.status(500).json({ error: "Failed to update saved search" });
    }
  });

  app.delete("/api/saved-searches/:id", async (req, res) => {
    try {
      const success = await storage.deleteSavedSearch(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Saved search not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete saved search" });
    }
  });

  app.post("/api/ai/generate-domains", async (req, res) => {
    try {
      const parsed = generateDomainsRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const { keyword, count } = parsed.data;
      const domains = await generateDomainNames(keyword.trim(), count);
      res.json(domains);
    } catch (error) {
      console.error("AI generation error:", error);
      res.status(500).json({ error: "Failed to generate domains" });
    }
  });

  app.post("/api/ai/explain-score", async (req, res) => {
    try {
      const parsed = explainScoreRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const { domain, score } = parsed.data;
      const explanation = await explainDomainScore(domain, score);
      res.json({ explanation });
    } catch (error) {
      console.error("AI explanation error:", error);
      res.status(500).json({ error: "Failed to explain score" });
    }
  });

  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolio();
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolio", async (req, res) => {
    try {
      const parsed = insertPortfolioItemSchema.safeParse({
        domain: req.body.domain,
        purchasePrice: Number(req.body.purchasePrice) || 0,
        renewalDate: req.body.renewalDate || null,
        renewalCost: Number(req.body.renewalCost) || 0
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const item = await storage.addToPortfolio(parsed.data);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to portfolio" });
    }
  });

  app.delete("/api/portfolio/:id", async (req, res) => {
    try {
      const success = await storage.removeFromPortfolio(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Portfolio item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from portfolio" });
    }
  });

  return httpServer;
}
