import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const minScore = searchParams.get("minScore");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (minScore) where.score = { gte: parseInt(minScore) };

  const organizations = await prisma.organization.findMany({
    where,
    include: { contacts: true },
    orderBy: { score: "desc" },
  });

  return NextResponse.json(organizations);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const organization = await prisma.organization.create({
    data: {
      name: body.name,
      type: body.type,
      website: body.website,
      aum: body.aum,
      country: body.country,
      investmentFocus: body.investmentFocus || [],
      alternativeAllocation: body.alternativeAllocation,
      privateCreditExposure: body.privateCreditExposure,
      score: body.score || 0,
      sourceUrls: body.sourceUrls || [],
    },
  });

  await logAudit({
    action: "create",
    entity: "organization",
    entityId: organization.id,
    details: `Created organization: ${organization.name}`,
  });

  return NextResponse.json(organization, { status: 201 });
}
