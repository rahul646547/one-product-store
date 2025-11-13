const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding product...');
  
  await prisma.product.create({
    data: {
      title: "Test Product",
      description: "This is a test product",
      price: 1000,
      imageUrl: "https://via.placeholder.com/150",
      inventory: 10
    }
  });

  console.log('Seed completed!');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1); // ensures Render sees failure if seed fails
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
