import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AuroMakeover Enterprise Database...');

  // 1. Clear existing data (optional, be careful in prod!)
  // await prisma.customer.deleteMany();
  // await prisma.lead.deleteMany();
  // await prisma.salesAgent.deleteMany();
  
  // 2. Create Default Sales Agent
  const agent = await prisma.salesAgent.upsert({
    where: { name: 'Deepak S.' },
    update: {},
    create: {
      name: 'Deepak S.',
      phone: '+919999999999',
      cities: ['Hyderabad'],
      societies: ['My Home Bhooja', 'Prestige High Fields'],
      isActive: true,
      isDemo: true,
    }
  });

  // 3. Create Society Layouts
  const society1 = await prisma.societyLayout.create({
    data: {
      societyName: 'My Home Bhooja',
      tower: 'T3',
      unitType: '3BHK Standard',
      presetWallSpecs: { livingRoom: { w: 12, h: 10 }, masterBed: { w: 10, h: 10 } },
    }
  });

  // 4. Create Customers with 360° Profile
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Arjun Reddy',
      phone: '+919876543210',
      email: 'arjun.reddy@example.com',
      lifecycleStage: 'INSTALLING',
      lifetimeValue: 120000,
      projectCount: 1,
      npsScore: 9,
      referralCode: 'AURO-AR7K',
      score: {
        create: {
          engagementScore: 85,
          intentScore: 90,
          valueScore: 75,
          compositeScore: 84,
          tier: 'S'
        }
      },
      addresses: {
        create: {
          society: 'My Home Bhooja',
          tower: 'T3',
          unit: '1204',
          city: 'Hyderabad',
          pincode: '500032',
          isPrimary: true
        }
      },
      timeline: {
        createMany: {
          data: [
            { eventType: 'SYSTEM', channel: 'WEB', summary: 'Lead captured via AI Style Quiz.', actorName: 'System' },
            { eventType: 'CALL', channel: 'PHONE', summary: 'Initial callback. Budget ~₹1L.', actorName: 'Deepak S.' },
            { eventType: 'PAYMENT', channel: 'WEB', summary: '10% Booking Deposit — ₹5,500 received.', actorName: 'Razorpay' }
          ]
        }
      },
      tags: {
        createMany: {
          data: [{ tag: 'VIP' }, { tag: 'HIGH_VALUE' }]
        }
      }
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Priya Sharma',
      phone: '+919123456789',
      email: 'priya.s@example.com',
      lifecycleStage: 'QUOTE_SENT',
      lifetimeValue: 0,
      projectCount: 0,
      referralCode: 'AURO-PR2M',
      score: {
        create: {
          engagementScore: 60,
          intentScore: 65,
          valueScore: 60,
          compositeScore: 62,
          tier: 'A'
        }
      },
      addresses: {
        create: {
          society: 'Aparna Sarovar',
          tower: 'T1',
          unit: '803',
          city: 'Hyderabad',
          isPrimary: true
        }
      },
      tags: {
        create: { tag: 'REFERRAL_SOURCE' }
      }
    }
  });

  console.log(`✅ Seeded Customer: ${customer1.name} (S-Tier)`);
  console.log(`✅ Seeded Customer: ${customer2.name} (A-Tier)`);
  console.log('🌱 Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
