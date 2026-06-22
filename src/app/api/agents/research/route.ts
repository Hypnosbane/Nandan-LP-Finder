import { NextRequest, NextResponse } from "next/server";
import { runResearchAgent } from "@/lib/agents";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.organizationName) {
    return NextResponse.json(
      { error: "organizationName is required" },
      { status: 400 }
    );
  }

  try {
    const research = await runResearchAgent({
      organizationName: body.organizationName,
      investorType: body.investorType || "unknown",
      website: body.website || null,
    });

    await logAudit({
      action: "agent_research",
      entity: "organization",
      details: `Researched ${body.organizationName}`,
    });

    return NextResponse.json(research);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Research agent failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
