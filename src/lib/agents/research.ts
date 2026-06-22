import { callClaude, loadPrompt } from "../llm/client";

interface ResearchResult {
  summary: string;
  investmentHistory: string;
  fundPreferences: string;
  sources: string[];
}

export async function runResearchAgent(params: {
  organizationName: string;
  investorType: string;
  website: string | null;
}): Promise<ResearchResult> {
  const prompt = loadPrompt("investor-research", {
    organization_name: params.organizationName,
    investor_type: params.investorType,
    website: params.website || "Not available",
  });

  const systemPrompt = `You are an Investor Research Agent specializing in the Indian alternative investment market.
You have knowledge of SEBI-registered funds, Indian family offices, insurance companies (regulated by IRDAI),
pension funds (EPFO, NPS via PFRDA), and other institutional investors in India.
Research their investment history focusing on alternatives, private credit, and structured credit.
Return ONLY valid JSON matching the expected schema.
All claims must be based on publicly available information. Cite sources.`;

  return callClaude<ResearchResult>({
    systemPrompt,
    userMessage: prompt,
  });
}
