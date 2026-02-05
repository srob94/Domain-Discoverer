import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { generateDomainNames, explainDomainScore } from "./ai";
import { 
  insertPortfolioItemSchema, 
  generateDomainsRequestSchema, 
  explainScoreRequestSchema,
  insertNotificationSchema,
  sendEmailRequestSchema,
  emailTypeEnum
} from "@shared/schema";
import { sendEmail, getEmailLogs, renderEmailPreview } from "./emailService";
import { setupAuth, registerAuthRoutes, authStorage } from "./replit_integrations/auth";

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

const updateAdminDomainSchema = z.object({
  isHidden: z.boolean().optional(),
  isFlagged: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  score: z.number().min(0).max(100).optional()
});

const updateAdminUserSchema = z.object({
  isPro: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  isDisabled: z.boolean().optional()
});

const updateAdminSettingsSchema = z.object({
  enabledTlds: z.array(z.string()).optional(),
  blockedTlds: z.array(z.string()).optional(),
  premiumRenewalThreshold: z.number().min(0).optional(),
  featureFlags: z.object({
    aiBuilder: z.boolean(),
    trendBadges: z.boolean(),
    investorInterest: z.boolean()
  }).optional()
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

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
      
      if (req.user?.email) {
        sendEmail(req.user.id, "watchlist_confirmation", req.user.email, {
          first_name: req.user.firstName || "there",
          domain: item.domain.fqdn,
          status: item.domain.status,
          drops_in: item.domain.dropsIn,
          renewal_price: item.domain.renewalPrice
        }).catch(console.error);
        
        const watchlist = await storage.getWatchlist();
        if (watchlist.length >= 10) {
          sendEmail(req.user.id, "watchlist_limit_upgrade", req.user.email, {
            first_name: req.user.firstName || "there"
          }).catch(console.error);
        }
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

  app.get("/api/notifications", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const notifications = await storage.getNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const notification = await storage.markNotificationAsRead(req.params.id, req.user.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.patch("/api/notifications/read-all", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await storage.markAllNotificationsAsRead(req.user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const parsed = insertNotificationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const notification = await storage.createNotification(req.user.id, parsed.data);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.post("/api/emails/send", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const parsed = sendEmailRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const { type, to, variables } = parsed.data;
      const log = await sendEmail(req.user.id, type, to, variables);
      res.status(201).json(log);
    } catch (error) {
      console.error("Email send error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.get("/api/emails/logs", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const logs = getEmailLogs(req.user.id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch email logs" });
    }
  });

  app.post("/api/emails/preview", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const typeResult = emailTypeEnum.safeParse(req.body.type);
      if (!typeResult.success) {
        return res.status(400).json({ error: "Invalid email type" });
      }
      const preview = renderEmailPreview(typeResult.data, req.body.variables || {});
      res.json(preview);
    } catch (error) {
      res.status(500).json({ error: "Failed to render email preview" });
    }
  });

  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const dbUser = await authStorage.getUser(req.user.claims.sub);
      if (!dbUser || !dbUser.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      req.dbUser = dbUser;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Failed to verify admin status" });
    }
  };

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/domains", requireAdmin, async (req, res) => {
    try {
      const domains = await storage.getAdminDomains();
      res.json(domains);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin domains" });
    }
  });

  app.patch("/api/admin/domains/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = updateAdminDomainSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const updated = await storage.updateAdminDomain(id, parsed.data);
      if (!updated) {
        return res.status(404).json({ error: "Domain not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update domain" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const search = req.query.search as string || "";
      const users = await storage.getAdminUsers(search);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = updateAdminUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const updated = await storage.updateAdminUser(id, parsed.data);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const parsed = updateAdminSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const settings = await storage.updateAdminSettings(parsed.data);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.get("/api/admin/alerts", requireAdmin, async (req, res) => {
    try {
      const alerts = await storage.getAdminAlertLogs();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alert logs" });
    }
  });

  return httpServer;
}
