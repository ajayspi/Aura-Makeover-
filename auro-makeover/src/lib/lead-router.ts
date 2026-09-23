import type { CityConfig } from './cities';

export interface SalesAgent {
  id: string;
  name: string;
  phone: string;
  cities: string[];
  societies: string[];
  isActive: boolean;
  weight: number;
  isDemo?: boolean;
}

export interface RouteInput {
  citySlug?: string | null;
  society?: string | null;
  /** agentId -> leads routed in the trailing window; ties broken deterministically */
  recentCounts?: Record<string, number>;
}

const norm = (s: string) => s.trim().toLowerCase();

/** Resolve a city slug from a society name using the cities config. Returns null when unknown. */
export function findCityForSociety(
  societyName: string | null | undefined,
  cities: Record<string, CityConfig>,
): string | null {
  const needle = norm(societyName ?? '');
  if (!needle) return null;
  for (const [slug, cfg] of Object.entries(cities)) {
    if ((cfg.societies ?? []).some((s) => norm(s.name) === needle)) return slug;
  }
  return null;
}

/**
 * Deterministic agent selection:
 * 1. Drop inactive agents (empty pool -> null fallback to city default number).
 * 2. Narrow to the requested city; unknown/empty city keeps the whole pool.
 * 3. Narrow to the requested society when at least one agent lists it; else keep the city pool.
 * 4. Sort by weight desc, then fewest recent routes, then id (stable tiebreak).
 */
export function routeLead(input: RouteInput, agents: SalesAgent[]): SalesAgent | null {
  const pool = agents.filter((a) => a.isActive);
  if (pool.length === 0) return null;

  const city = norm(input.citySlug ?? '');
  const cityPool = city ? pool.filter((a) => a.cities.map(norm).includes(city)) : pool;
  const base = cityPool.length > 0 ? cityPool : pool;

  const society = norm(input.society ?? '');
  const narrowed = society
    ? base.filter((a) => a.societies.length === 0 || a.societies.map(norm).includes(society))
    : base;
  const candidates = narrowed.length > 0 ? narrowed : base;

  const counts = input.recentCounts ?? {};
  return (
    [...candidates].sort((x, y) => {
      if (y.weight !== x.weight) return y.weight - x.weight;
      const cx = counts[x.id] ?? 0;
      const cy = counts[y.id] ?? 0;
      if (cx !== cy) return cx - cy;
      return x.id < y.id ? -1 : x.id > y.id ? 1 : 0;
    })[0] ?? null
  );
}
