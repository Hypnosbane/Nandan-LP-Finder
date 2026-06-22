import { NextRequest, NextResponse } from "next/server";
import { runDiscoveryAgent } from "@/lib/agents";
import { logAudit } from "@/lib/audit";
import type { FundProfile } from "@/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as FundProfile;

  if (!body.fundStrategy || !body.targetLpTypes?.length) {
    return NextResponse.json(
      { error: "fundStrategy and targetLpTypes are required" },
      { status: 400 }
    );
  }

  try {
    const candidates = await runDiscoveryAgent(body);

    await logAudit({
      action: "agent_discovery",
      entity: "fund_profile",
      details: `Discovered ${candidates.length} LP candidates for ${body.fundStrategy} in ${body.geography}`,
    });

    return NextResponse.json({ candidates, count: candidates.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Discovery agent failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
