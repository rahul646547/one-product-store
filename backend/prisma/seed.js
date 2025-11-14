const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.create({
    data: {
      title: "Premium Hair Trimmer",
      description: "High-quality professional trimmer with stainless steel blades.",
      imageUrl: "https://your-image-link-here",
      price: 20000, // 💰 200 INR → 200 * 100 = 20000 paise
      inventory: 50
    }
  });

  console.log("🌱 Database seeded with ₹200 product!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
