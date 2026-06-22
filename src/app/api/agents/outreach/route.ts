import { NextRequest, NextResponse } from "next/server";
import { runOutreachAgent } from "@/lib/agents";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.organizationName || !body.contactName || !body.fundStrategy) {
    return NextResponse.json(
      { error: "organizationName, contactName, and fundStrategy are required" },
      { status: 400 }
    );
  }

  try {
    const email = await runOutreachAgent({
      organizationName: body.organizationName,
      contactName: body.contactName,
      contactRole: body.contactRole || "",
      investorType: body.investorType || "",
      fundStrategy: body.fundStrategy,
      personalizationNotes: body.personalizationNotes || "",
      investmentThesis: body.investmentThesis || "",
      fundOverview: body.fundOverview || "",
      variant: body.variant || "standard",
    });

    await logAudit({
      action: "agent_outreach",
      entity: "email",
      details: `Generated ${body.variant || "standard"} email for ${body.contactName} at ${body.organizationName}`,
    });

    return NextResponse.json(email);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Outreach agent failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
