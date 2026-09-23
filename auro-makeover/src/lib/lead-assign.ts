import { routeLead, findCityForSociety, type SalesAgent } from '@/lib/lead-router';
import { CITIES } from '@/lib/cities';

type PrismaLike = {
  saleAgent: { findMany(args?: unknown): Promise<unknown[]> };
  lead: {
    count(args: unknown): Promise<unknown>;
  };
};

type AgentRow = {
  id: string;
  name: string;
  phone: string;
  cities: string[];
  societies: string[];
  isActive: boolean;
  weight: number;
  isDemo?: boolean;
};

function toSalesAgent(row: unknown): SalesAgent | null {
  const r = row as Partial<AgentRow>;
  if (!r || typeof r.id !== 'string' || typeof r.phone !== 'string') return null;
  return {
    id: r.id,
    name: r.name ?? r.id,
    phone: r.phone,
    cities: Array.isArray(r.cities) ? r.cities : [],
    societies: Array.isArray(r.societies) ? r.societies : [],
    isActive: r.isActive !== false,
    weight: typeof r.weight === 'number' ? r.weight : 1,
    isDemo: !!r.isDemo,
  };
}

/**
 * Resolve the assigned agent for a lead. Never throws: on any DB failure
 * returns null and the caller falls back to the city default WhatsApp number.
 */
export async function assignAgent(
  prisma: PrismaLike,
  opts: { citySlug?: string | null; society?: string | null },
): Promise<{ agent: SalesAgent | null; citySlug: string | null }> {
  try {
    const rows = await prisma.saleAgent.findMany({ where: { isActive: true } });
    const agents = rows.map(toSalesAgent).filter((a): a is SalesAgent => a !== null);
    if (agents.length === 0) return { agent: null, citySlug: opts.citySlug ?? null };

    let citySlug = opts.citySlug ?? null;
    if (!citySlug && opts.society) {
      citySlug = findCityForSociety(opts.society, CITIES);
    }

    let recentCounts: Record<string, number> = {};
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const grouped = (await prisma.lead.count({
        // groupBy shape when the generated client supports it; stub-typed otherwise
        by: ['assignedAgentId'],
        where: { routedAt: { gte: since }, assignedAgentId: { not: null } },
      })) as unknown;
      if (Array.isArray(grouped)) {
        for (const g of grouped) {
          const row = g as { assignedAgentId?: string; _count?: { assignedAgentId?: number } | number };
          if (row.assignedAgentId) {
            recentCounts[row.assignedAgentId] =
              typeof row._count === 'number' ? row._count : row._count?.assignedAgentId ?? 0;
          }
        }
      }
    } catch {
      recentCounts = {};
    }

    return { agent: routeLead({ citySlug, society: opts.society, recentCounts }, agents), citySlug };
  } catch {
    return { agent: null, citySlug: opts.citySlug ?? null };
  }
}
