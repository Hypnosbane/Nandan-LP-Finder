import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const organizationId = searchParams.get("organizationId");
  const minConfidence = searchParams.get("minConfidence");

  const where: Record<string, unknown> = {};
  if (organizationId) where.organizationId = organizationId;
  if (minConfidence)
    where.emailConfidence = { gte: parseInt(minConfidence) };

  const contacts = await prisma.contact.findMany({
    where,
    include: { organization: true },
    orderBy: { emailConfidence: "desc" },
  });

  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const contact = await prisma.contact.create({
    data: {
      organizationId: body.organizationId,
      name: body.name,
      title: body.title,
      email: body.email,
      emailConfidence: body.emailConfidence || 0,
      linkedinUrl: body.linkedinUrl,
      source: body.source,
    },
  });

  await logAudit({
    action: "create",
    entity: "contact",
    entityId: contact.id,
    details: `Created contact: ${contact.name} at org ${contact.organizationId}`,
  });

  return NextResponse.json(contact, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await prisma.contact.delete({ where: { id } });

  await logAudit({
    action: "delete",
    entity: "contact",
    entityId: id,
    details: "Contact record deleted per user request",
  });

  return NextResponse.json({ deleted: true });
}
