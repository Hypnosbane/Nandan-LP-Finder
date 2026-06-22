export interface FundProfile {
  fundName: string;
  fundStrategy: string;
  fundSize: string;
  geography: string;
  vintageYear: number;
  minTicketSize: number;
  maxTicketSize: number;
  targetLpTypes: LpType[];
}

export type LpType =
  | "family_office"
  | "endowment"
  | "foundation"
  | "pension_fund"
  | "sovereign_wealth"
  | "fund_of_funds"
  | "insurance"
  | "ria"
  | "ocio";

export interface LpCandidate {
  organizationName: string;
  investorType: LpType;
  location: string;
  estimatedAum: number | null;
  alternativeAllocation: number | null;
  privateCreditExposure: number | null;
  investmentFocus: string[];
  website: string | null;
  sourceUrls: string[];
}

export interface ContactRecord {
  name: string;
  title: string;
  email: string | null;
  emailConfidence: number;
  linkedinUrl: string | null;
  source: "apollo" | "rocketreach" | "website" | "manual";
}

export interface InvestmentFitScore {
  alternativeInvestments: number;
  privateCreditHistory: number;
  ticketSizeMatch: number;
  regionMatch: number;
  recentActivity: number;
  total: number;
}

export interface OutreachEmail {
  subject: string;
  body: string;
  variant: "short" | "standard" | "executive";
}
