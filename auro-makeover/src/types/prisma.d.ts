// Minimal Prisma Client type for local type-checking
// Full client generated at deploy time via Prisma 8 platform

declare module '@prisma/client' {
  export interface SaleAgentDelegate {
    findMany(args?: unknown): Promise<unknown[]>;
    upsert(args: { where: { name: string }; update: unknown; create: unknown }): Promise<unknown>;
  }
  export interface LeadDelegate {
    upsert(args: { where: { sessionId: string }; update: unknown; create: unknown }): Promise<unknown>;
    create(args: { data: unknown }): Promise<unknown>;
    count(args?: unknown): Promise<unknown>;
  }
  export interface PrismaClient {
    lead: LeadDelegate;
    saleAgent: SaleAgentDelegate;
  }
  export const PrismaClient: new () => PrismaClient;
}
