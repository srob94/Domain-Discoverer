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
