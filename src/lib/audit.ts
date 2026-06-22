import { prisma } from "./db";

export async function logAudit(params: {
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
}) {
  return prisma.auditLog.create({
    data: {
      action: params.action,
      entity: params.entity,
      entityId: params.entityId ?? null,
      details: params.details ?? null,
    },
  });
}
