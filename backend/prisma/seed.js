const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      title: "Test Product",
      description: "This is a test product",
      price: 1000,
      imageUrl: "https://via.placeholder.com/150",
      inventory: 10
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
