import type { FundProfile, InvestmentFitScore, LpCandidate } from "@/types";

const MAX_SCORES = {
  alternativeInvestments: 20,
  privateCreditHistory: 25,
  ticketSizeMatch: 20,
  regionMatch: 15,
  recentActivity: 20,
};

export function scoreLpCandidate(
  candidate: LpCandidate,
  fundProfile: FundProfile
): InvestmentFitScore {
  const alternativeInvestments =
    candidate.alternativeAllocation && candidate.alternativeAllocation > 0
      ? Math.min(
          Math.round(
            (candidate.alternativeAllocation / 100) *
              MAX_SCORES.alternativeInvestments
          ),
          MAX_SCORES.alternativeInvestments
        )
      : 0;

  const privateCreditHistory =
    candidate.privateCreditExposure && candidate.privateCreditExposure > 0
      ? Math.min(
          Math.round(
            (candidate.privateCreditExposure / 100) *
              MAX_SCORES.privateCreditHistory *
              2
          ),
          MAX_SCORES.privateCreditHistory
        )
      : 0;

  const ticketSizeMatch =
    candidate.estimatedAum &&
    candidate.estimatedAum >= fundProfile.minTicketSize * 10
      ? MAX_SCORES.ticketSizeMatch
      : candidate.estimatedAum
        ? Math.round(MAX_SCORES.ticketSizeMatch * 0.5)
        : 0;

  const regionMatch = candidate.location
    .toLowerCase()
    .includes(fundProfile.geography.toLowerCase())
    ? MAX_SCORES.regionMatch
    : 0;

  const recentActivity = Math.round(MAX_SCORES.recentActivity * 0.5);

  const total =
    alternativeInvestments +
    privateCreditHistory +
    ticketSizeMatch +
    regionMatch +
    recentActivity;

  return {
    alternativeInvestments,
    privateCreditHistory,
    ticketSizeMatch,
    regionMatch,
    recentActivity,
    total,
  };
}
