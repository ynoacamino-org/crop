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

  if (users.length === 0) {
    console.log("📝 No users found. Creating a demo user...");
    
    const demoUser = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        image: faker.image.avatar(),
        role: "PUBLIC",
      },
    });

    users = [demoUser];
    console.log(`✅ Created demo user: ${demoUser.name} (${demoUser.email})`);
  }

  console.log(`✅ Found ${users.length} users`);

  const posts = [];
  for (let i = 0; i < 100; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)] as User;

    posts.push({
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      description: faker.lorem.paragraphs({ min: 1, max: 3 }),
      image: faker.image.url({ width: 1200, height: 800 }),
      userId: randomUser.id,
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
