import { callClaude, loadPrompt } from "../llm/client";
import { getProviders } from "../providers";
import type { FundProfile, LpCandidate } from "@/types";

export async function runDiscoveryAgent(
  fundProfile: FundProfile
): Promise<LpCandidate[]> {
  const providers = getProviders();
  const providerResults = await Promise.allSettled(
    providers.map((p) =>
      p.searchOrganizations(fundProfile.fundStrategy, {
        category: "Category II",
        state: fundProfile.geography,
      })
    )
  );

  const existingOrgs = providerResults
    .filter(
      (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof providers[0]["searchOrganizations"]>>> =>
        r.status === "fulfilled"
    )
    .flatMap((r) => r.value);

  const providerContext = existingOrgs.length > 0
    ? `\n\nKnown organizations from data providers:\n${JSON.stringify(existingOrgs.map((o) => ({ name: o.name, location: o.location, industry: o.industry, description: o.description })), null, 2)}`
    : "";

  const prompt = loadPrompt("lp-discovery", {
    fund_profile: JSON.stringify(fundProfile, null, 2),
    target_lp_types: fundProfile.targetLpTypes.join(", "),
    geography: fundProfile.geography,
    min_ticket_size: formatINR(fundProfile.minTicketSize),
    max_ticket_size: formatINR(fundProfile.maxTicketSize),
  });

  const systemPrompt = `You are an LP Discovery Agent specializing in the Indian alternative investment market.
You have deep knowledge of SEBI-registered AIFs, Indian family offices, insurance companies, pension funds (EPFO, NPS), and institutional investors.
Focus on India-based investors unless the fund profile specifies otherwise.
Return ONLY valid JSON — an array of LP candidate objects.${providerContext}`;

  const candidates = await callClaude<LpCandidate[]>({
    systemPrompt,
    userMessage: prompt,
  });

  return candidates;
}

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}
