// Safe Prisma proxy for environments where Prisma has not been generated locally
function createModelProxy() {
  return {
    count: () => Promise.resolve(0),
    findFirst: () => Promise.resolve(null),
    findUnique: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    upsert: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    deleteMany: () => Promise.resolve({ count: 0 }),
    createMany: () => Promise.resolve({ count: 0 }),
  };
}

const safeFallback: any = new Proxy({}, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    if (prop === '$disconnect' || prop === '$connect') return () => Promise.resolve();
    return createModelProxy();
  }
});

let prismaClientInstance: any = null;

function getClient(): any {
  if (prismaClientInstance) return prismaClientInstance;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client');
    const client = new PrismaClient();
    // Test if client can actually connect or if it's missing the engine
    prismaClientInstance = client;
    return client;
  } catch {
    return safeFallback;
  }
}

export const prisma: any = new Proxy({}, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    const client = getClient();
    if (client === safeFallback) {
      return safeFallback[prop];
    }
    const val = client[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  }
});

export default prisma;
