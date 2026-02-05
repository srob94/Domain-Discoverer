import { randomUUID } from "crypto";
import type { EmailType, EmailLog } from "@shared/schema";

interface EmailTemplate {
  subject: string;
  preview: string;
  body: string;
}

type TemplateVariables = Record<string, string | number>;

const templates: Record<EmailType, EmailTemplate> = {
  welcome: {
    subject: "Welcome to TLDTerminal — today's best drops are live",
    preview: "Your daily domain deal terminal starts now.",
    body: "Hi {{first_name}},\n\nWelcome to TLDTerminal.\n\nYou now have access to today's ranked drop feed — domains dropping soon, scored for resale potential, and flagged for premium renewal traps.\n\nStart here:\n→ View today's drop list\n\nPro tip: Watch a few domains so we can notify you before they drop.\n\nSee you inside,\n— TLDTerminal"
  },

  activation_nudge: {
    subject: "Watch your first domain (it's the fastest way to win drops)",
    preview: "Most investors start with 3–5 watches.",
    body: "Hi {{first_name}},\n\nQuick tip: the best way to use TLDTerminal is to watch domains early.\n\nWhen you watch a name, you'll be ready when it drops — before everyone else.\n\nStart watching here:\n→ Today's Drop Feed\n\n— TLDTerminal"
  },

  watchlist_confirmation: {
    subject: "Added to your watchlist: {{domain}}",
    preview: "We'll track this drop timing for you.",
    body: "Hi {{first_name}},\n\nYou just watched: {{domain}}\n\nDrop status: {{status}}\nDrops in: {{drops_in}}\nRenewal: ${{renewal_price}}/yr\n\nWe'll notify you when it gets close.\n\n→ View Watchlist\n\n— TLDTerminal"
  },

  watchlist_limit_upgrade: {
    subject: "Your watchlist is full — don't miss drops",
    preview: "Upgrade for unlimited tracking + alerts.",
    body: "Hi {{first_name}},\n\nYou've hit the Starter watchlist limit (10 domains).\n\nPro investors use TLDTerminal to track unlimited names and get drop alerts automatically.\n\nUpgrade unlocks:\n• Unlimited watchlist\n• Drop notifications\n• Saved searches\n• AI Domain Builder\n\n→ Upgrade to Pro\n\n— TLDTerminal"
  },

  saved_search_locked: {
    subject: "Automate your deal flow with Saved Searches",
    preview: "Get alerted when new high-score domains drop.",
    body: "Hi {{first_name}},\n\nSaved Searches are how serious investors never miss opportunities.\n\nExample:\n\"2-word AI .com, score > 80, renewal < $30\"\n\nPro unlocks:\n• Unlimited saved searches\n• Instant match alerts\n• Trend + investor interest signals\n\n→ Start Pro Trial\n\n— TLDTerminal"
  },

  trial_start: {
    subject: "Your Pro trial is active — alerts are now running",
    preview: "The terminal is fully unlocked.",
    body: "Hi {{first_name}},\n\nWelcome to Pro. Your trial is now active.\n\nYou've unlocked:\n• Unlimited watchlist\n• Saved searches + alerts\n• AI Domain Builder\n• Trend + investor interest signals\n• Portfolio renewal tracking\n\nStart here:\n→ Create your first saved search\n\n— TLDTerminal"
  },

  drop_alert: {
    subject: "{{domain}} drops soon ({{drops_in}})",
    preview: "This is your window to act.",
    body: "Hi {{first_name}},\n\nA watched domain is dropping soon:\n\n{{domain}}\nDrops in: {{drops_in}}\nScore: {{score}}\nRenewal: ${{renewal_price}}/yr\n\nBuy now before it's gone:\n→ Purchase Link\n\n— TLDTerminal Alerts"
  },

  search_match_alert: {
    subject: "New domains match your search: \"{{search_name}}\"",
    preview: "{{match_count}} new opportunities today.",
    body: "Hi {{first_name}},\n\nYour saved search just found {{match_count}} new matches:\n\nTop results:\n• {{domain_1}} (Score {{score_1}})\n• {{domain_2}} (Score {{score_2}})\n• {{domain_3}} (Score {{score_3}})\n\n→ View Matches\n\n— TLDTerminal"
  },

  premium_renewal_warning: {
    subject: "Renewal warning on {{domain}}",
    preview: "Premium renewals can destroy ROI.",
    body: "Hi {{first_name}},\n\nHeads up — one of your watched domains has a premium renewal cost:\n\n{{domain}}\nRenewal: ${{renewal_price}}/yr (Warning: Premium)\n\nPremium renewals can be a long-term holding risk.\n\n→ Review Domain\n\n— TLDTerminal"
  },

  investor_interest: {
    subject: "Investors are watching {{domain}}",
    preview: "Rising interest may mean competition.",
    body: "Hi {{first_name}},\n\nInvestor interest is increasing:\n\n{{domain}}\nWatchlisted by: {{watch_count}} investors\nScore: {{score}}\nDrops in: {{drops_in}}\n\nThis may get competitive quickly.\n\n→ View Domain\n\n— TLDTerminal"
  },

  trial_ending: {
    subject: "Your Pro trial ends in {{days_left}} days",
    preview: "Keep alerts running without interruption.",
    body: "Hi {{first_name}},\n\nYour Pro trial ends in {{days_left}} days.\n\nTo keep:\n• Drop alerts\n• Saved searches\n• AI Builder\n• Investor interest signals\n\nContinue Pro here:\n→ Manage Subscription\n\n— TLDTerminal"
  },

  conversion: {
    subject: "Keep your edge — Pro stays active",
    preview: "Don't lose automation right before drops.",
    body: "Hi {{first_name}},\n\nInvestors who win consistently don't rely on manual searching.\n\nPro keeps your deal flow automated with:\n• Alerts\n• Saved searches\n• Trend + watch signals\n• Renewal protection\n\n→ Stay on Pro\n\n— TLDTerminal"
  },

  churn_save: {
    subject: "Before you go — want to pause instead?",
    preview: "Don't lose your watchlists and searches.",
    body: "Hi {{first_name}},\n\nSorry to see you go.\n\nIf cost is the issue, you can pause instead of canceling — your watchlist and searches stay saved.\n\nOr tell us what would make Pro worth it.\n\n→ Manage Subscription\n\n— TLDTerminal Team"
  },

  weekly_digest: {
    subject: "Weekly Drop Digest — top domains this week",
    preview: "Best opportunities + trending keywords.",
    body: "Hi {{first_name}},\n\nHere are the top opportunities this week:\n\nTop drops:\n• {{domain_1}} (Score {{score_1}})\n• {{domain_2}} (Score {{score_2}})\n\nTrending keywords:\n• \"{{keyword_1}}\" ↑\n• \"{{keyword_2}}\" ↑\n• \"{{keyword_3}}\" ↑\n\n→ View Full Digest\n\n— TLDTerminal"
  }
};

function interpolate(template: string, variables: TemplateVariables): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];
    return value !== undefined ? String(value) : match;
  });
}

function renderEmail(type: EmailType, variables: TemplateVariables = {}): { subject: string; preview: string; body: string; html: string } {
  const template = templates[type];
  if (!template) {
    throw new Error("Unknown email type: " + type);
  }

  const subject = interpolate(template.subject, variables);
  const preview = interpolate(template.preview, variables);
  const body = interpolate(template.body, variables);
  
  const bodyHtml = body.split('\n\n').map(p => {
    if (p.startsWith('•') || p.includes('\n•')) {
      const items = p.split('\n').filter(l => l.startsWith('•')).map(l => "<li>" + l.substring(1).trim() + "</li>").join('');
      return "<ul>" + items + "</ul>";
    }
    if (p.startsWith('→')) {
      return '<a href="#" class="cta">' + p.substring(1).trim() + '</a>';
    }
    return "<p>" + p.replace(/\n/g, '<br>') + "</p>";
  }).join('');
  
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' + subject + '</title><style>body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; } .preview { display: none; max-height: 0; overflow: hidden; } .logo { font-weight: bold; font-size: 20px; color: #1a56db; margin-bottom: 24px; } .content { background: #f8fafc; border-radius: 8px; padding: 24px; margin: 16px 0; } .cta { display: inline-block; background: #1a56db; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0; } .footer { color: #64748b; font-size: 14px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; } ul { padding-left: 20px; } li { margin: 4px 0; }</style></head><body><div class="preview">' + preview + '</div><div class="logo">TLDTerminal</div><div class="content">' + bodyHtml + '</div><div class="footer">TLDTerminal — Domain investing intelligence</div></body></html>';

  return { subject, preview, body, html };
}

const emailLogs: Map<string, EmailLog> = new Map();

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

async function sendWithResend(to: string, subject: string, html: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.log("[Email Mock] Would send to " + to + ": \"" + subject + "\"");
    return { success: true, messageId: "mock-" + randomUUID() };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TLDTerminal <notifications@tldterminal.com>',
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Email Error] Failed to send: " + error);
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("[Email Error] " + error);
    return { success: false, error: String(error) };
  }
}

export async function sendEmail(
  userId: string,
  type: EmailType,
  to: string,
  variables: TemplateVariables = {}
): Promise<EmailLog> {
  const { subject, html } = renderEmail(type, variables);
  const result = await sendWithResend(to, subject, html);

  const log: EmailLog = {
    id: randomUUID(),
    userId,
    type,
    to,
    subject,
    sentAt: new Date().toISOString(),
    status: result.success ? (process.env.RESEND_API_KEY ? "sent" : "mock") : "failed"
  };

  emailLogs.set(log.id, log);
  return log;
}

export function getEmailLogs(userId: string): EmailLog[] {
  return Array.from(emailLogs.values())
    .filter(log => log.userId === userId)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
}

export function renderEmailPreview(type: EmailType, variables: TemplateVariables = {}) {
  return renderEmail(type, variables);
}

export { templates };
