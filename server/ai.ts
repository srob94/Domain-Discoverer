import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface GeneratedDomain {
  fqdn: string;
  score: number;
  reason: string;
  tld: string;
}

export async function generateDomainNames(
  keyword: string,
  count: number = 30
): Promise<GeneratedDomain[]> {
  const prompt = `You are a domain name expert. Generate ${count} creative, brandable domain name ideas based on the keyword/niche: "${keyword}".

For each domain, provide:
1. The full domain name (fqdn) with a TLD (.com, .io, .ai, .co, .dev, .net, .app)
2. A brandability score from 60-99 (higher = more brandable, shorter, memorable)
3. A brief reason why this domain is valuable (1 sentence)

Prioritize:
- Short, memorable names (5-12 characters before TLD)
- Easy to spell and pronounce
- Relevant to the keyword but creative
- Mix of different TLDs
- Names that work for startups/businesses

Return a JSON object with a "domains" array containing objects with: fqdn, score, reason, tld
Example: {"domains": [{"fqdn": "finwise.ai", "score": 88, "reason": "Short, memorable, combines finance with wisdom", "tld": ".ai"}]}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content || "{}";
  
  try {
    const parsed = JSON.parse(content);
    const domains = parsed.domains || parsed.results || parsed;
    
    if (Array.isArray(domains)) {
      return domains.map((d: any) => ({
        fqdn: d.fqdn || d.domain || "",
        score: Math.min(99, Math.max(60, d.score || 75)),
        reason: d.reason || d.explanation || "",
        tld: d.tld || d.fqdn?.match(/\.[a-z]+$/)?.[0] || ".com"
      })).filter((d: GeneratedDomain) => d.fqdn);
    }
  } catch (e) {
    console.error("Failed to parse AI response:", e);
  }
  
  return [];
}

export async function explainDomainScore(domain: string, score: number): Promise<string> {
  const prompt = `You are a domain name expert. Briefly explain why the domain "${domain}" has a brandability score of ${score}/100.

Consider:
- Length and memorability
- Spelling and pronunciation ease
- TLD quality
- Keyword relevance
- Brand potential

Keep your explanation to 2-3 sentences.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  return response.choices[0]?.message?.content || "Unable to analyze this domain.";
}

export interface ConversationSearchFilters {
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
}

export async function parseConversationQuery(query: string): Promise<ConversationSearchFilters> {
  const prompt = `You are a domain name search assistant. Parse the user's natural language query into structured search filters for a domain drop feed.

User query: "${query}"

Analyze the query and extract the following in JSON format:
{
  "keywords": ["array", "of", "keywords"], // domain-related keywords mentioned (AI, finance, tech, etc.)
  "tlds": [".com", ".io"], // specific TLDs mentioned, or empty array
  "minScore": 85, // minimum brandability score if mentioned, or null
  "maxScore": null, // maximum score if mentioned, or null
  "maxRenewalPrice": 30, // max renewal price if mentioned, or null
  "status": "dropping", // "dropping", "expiring", "all", or null
  "timeWindowHours": 48, // time window like "next 24 hours" = 24, or null
  "trending": true, // if user wants trending domains, or null
  "queryType": "search", // "search" (find domains), "explain" (why is domain scored X), "similar" (find similar to X), "create_alert" (set up saved search)
  "targetDomain": null, // if explaining or finding similar, the domain name
  "explanation": "Brief 1-sentence description of what user is looking for"
}

Examples:
- "Find AI .com domains under $30" → keywords: ["AI"], tlds: [".com"], maxRenewalPrice: 30
- "Why is VaultLedger.io scored so high?" → queryType: "explain", targetDomain: "VaultLedger.io"
- "Alert me when fintech domains drop with score above 80" → queryType: "create_alert", keywords: ["fintech"], minScore: 80
- "What's similar to AgentVault?" → queryType: "similar", targetDomain: "AgentVault"

Return only valid JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content || "{}";
  
  try {
    const parsed = JSON.parse(content);
    return {
      keywords: parsed.keywords || [],
      tlds: parsed.tlds || [],
      minScore: parsed.minScore ?? null,
      maxScore: parsed.maxScore ?? null,
      maxRenewalPrice: parsed.maxRenewalPrice ?? null,
      status: parsed.status || null,
      timeWindowHours: parsed.timeWindowHours ?? null,
      trending: parsed.trending ?? null,
      queryType: parsed.queryType || "search",
      targetDomain: parsed.targetDomain || null,
      explanation: parsed.explanation || "Searching for domains..."
    };
  } catch (e) {
    console.error("Failed to parse conversation query:", e);
    return {
      keywords: [],
      tlds: [],
      minScore: null,
      maxScore: null,
      maxRenewalPrice: null,
      status: null,
      timeWindowHours: null,
      trending: null,
      queryType: "search",
      targetDomain: null,
      explanation: "Unable to parse your query. Try being more specific."
    };
  }
}

export async function explainWhyDomain(domain: string, score: number, trending: boolean): Promise<string> {
  const prompt = `You are a domain investing expert. Explain concisely why the domain "${domain}" with score ${score}/100 ${trending ? "(trending)" : ""} might be a good investment.

Keep it brief (3-4 bullet points), focusing on:
- Name quality (length, memorability, brandability)
- Market potential
- Renewal value
- Trending relevance if applicable

Format as short bullet points.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content || "Unable to analyze this domain.";
}
