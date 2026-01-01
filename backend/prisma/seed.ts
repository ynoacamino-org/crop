import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type User } from "./client/client";
import { DATABASE_URL } from "../src/config/env";

const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed with Faker...");

  let users = await prisma.user.findMany();

  console.log(`✅ Found ${users.length} users`);

  const posts = [];
  for (let i = 0; i < 100; i++) {
    posts.push({
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      description: faker.lorem.paragraphs({ min: 1, max: 3 }),
      image: faker.image.url({ width: 1200, height: 800 }),
    });
  }

  const result = await prisma.post.createMany({
    data: posts,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${result.count} posts`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
