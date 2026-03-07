import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // MongoDB: Prisma requires a replica set for write operations (create/delete).
  // Use Atlas (replica set by default) or run local MongoDB as replica set:
  //   mongod --replSet rs0
  // Skip if already seeded.
  const existing = await prisma.user.count();
  if (existing > 0) {
    console.log('Seed skipped: database already has data.');
    return;
  }

  const user1 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      role: 'USER',
      password: 'placeholder',
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      role: 'ADMIN',
      password: 'placeholder',
    },
  });

  const product1 = await prisma.product.create({
    data: { name: 'Product A', price: 9.99 },
  });
  const product2 = await prisma.product.create({
    data: { name: 'Product B', price: 19.99 },
  });

  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      total: 29.98,
      orderItems: {
        create: [
          { productId: product1.id, quantity: 1 },
          { productId: product2.id, quantity: 1 },
        ],
      },
    },
  });
  await prisma.order.create({
    data: {
      userId: user1.id,
      total: 9.99,
      orderItems: {
        create: [{ productId: product1.id, quantity: 1 }],
      },
    },
  });

  console.log('Seed done:', { user1, user2, product1, product2, order1 });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
