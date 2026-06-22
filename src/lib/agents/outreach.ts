import { callClaude, loadPrompt } from "../llm/client";
import type { OutreachEmail } from "@/types";

export async function runOutreachAgent(params: {
  organizationName: string;
  contactName: string;
  contactRole: string;
  investorType: string;
  fundStrategy: string;
  personalizationNotes: string;
  investmentThesis: string;
  fundOverview: string;
  variant: "short" | "standard" | "executive";
}): Promise<OutreachEmail> {
  const prompt = loadPrompt("outreach-email", {
    organization_name: params.organizationName,
    contact_name: params.contactName,
    contact_role: params.contactRole,
    investor_type: params.investorType,
    fund_strategy: params.fundStrategy,
    personalization_notes: params.personalizationNotes,
    investment_thesis: params.investmentThesis,
    fund_overview: params.fundOverview,
    variant: params.variant,
  });

  const systemPrompt = `You are an Outreach Email Writer for an Indian fund manager.
Write professional, warm emails appropriate for the Indian financial services context.
Respect Indian business communication norms — be formal but personable.
Do not be overly salesy. Reference specific, verifiable facts about the investor.
Return ONLY valid JSON with "subject" and "body" fields.`;

  const result = await callClaude<{ subject: string; body: string }>({
    systemPrompt,
    userMessage: prompt,
  });

  return {
    subject: result.subject,
    body: result.body,
    variant: params.variant,
  };
}
