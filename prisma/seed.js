/**
 * Seed the SalesAgent roster for lead auto-routing.
 *
 * Phone numbers are NEVER hardcoded here. Supply them at deploy time:
 *   SALES_AGENTS_JSON='[{"name":"...","phone":"91XXXXXXXXXX","cities":["hyderabad"],"societies":[],"weight":1}]'
 *   node prisma/seed.js
 *
 * Flags:
 *   --demo   seed two synthetic agents flagged isDemo=true (never real numbers;
 *            delete demo rows before production use)
 *
 * Fail-closed: without SALES_AGENTS_JSON (and without --demo) this script
 * seeds nothing and exits non-zero. Routing falls back to the city default
 * WhatsApp number when the roster is empty.
 */

const raw = process.env.SALES_AGENTS_JSON;
const isDemo = process.argv.includes('--demo');

async function main() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  let agents = [];
  if (raw) {
    try {
      agents = JSON.parse(raw);
    } catch {
      console.error('SALES_AGENTS_JSON is not valid JSON — seeding nothing.');
      process.exit(1);
    }
  } else if (isDemo) {
    agents = [
      { name: 'Demo Agent North', phone: '900000000001', cities: ['hyderabad'], societies: [], weight: 1, isDemo: true },
      { name: 'Demo Agent South', phone: '900000000002', cities: ['hyderabad', 'bangalore'], societies: [], weight: 1, isDemo: true },
    ];
    console.warn('Seeding DEMO agents only. Delete isDemo rows before production use.');
  } else {
    console.error('No SALES_AGENTS_JSON provided and --demo not passed — seeding nothing.');
    process.exit(1);
  }

  for (const a of agents) {
    if (!a.name || !/^\d{10,13}$/.test(String(a.phone || ''))) {
      console.error(`Skipping invalid agent entry: ${JSON.stringify(a)}`);
      continue;
    }
    await prisma.saleAgent.upsert({
      where: { name: a.name },
      update: {
        phone: String(a.phone),
        cities: a.cities || [],
        societies: a.societies || [],
        isActive: a.isActive !== false,
        weight: a.weight ?? 1,
        isDemo: !!a.isDemo,
      },
      create: {
        name: a.name,
        phone: String(a.phone),
        cities: a.cities || [],
        societies: a.societies || [],
        isActive: a.isActive !== false,
        weight: a.weight ?? 1,
        isDemo: !!a.isDemo,
      },
    });
    console.log(`Upserted agent: ${a.name}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
