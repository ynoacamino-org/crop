import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../src/config/env";
import { PrismaClient } from "./client/client";

const adapter = new PrismaPg({
	connectionString: DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Starting seed with Faker...");

	let users = await prisma.user.findMany();

	if (users.length === 0) {
		console.log("⚠️  No users found. Creating sample users...");

		const sampleUsers = [];
		for (let i = 0; i < 10; i++) {
			sampleUsers.push({
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
				emailVerified: faker.datatype.boolean(),
				image: faker.image.avatar(),
			});
		}

		await prisma.user.createMany({
			data: sampleUsers,
			skipDuplicates: true,
		});

		users = await prisma.user.findMany();
		console.log(`✅ Created ${users.length} sample users`);
	} else {
		console.log(`✅ Found ${users.length} existing users`);
	}

	await prisma.post.deleteMany({});
	console.log("🗑️  Deleted existing posts");

	await prisma.media.deleteMany({});
	console.log("🗑️  Deleted existing media");

	const mediaItems = [];
	for (let i = 0; i < 50; i++) {
		const randomUser = users[Math.floor(Math.random() * users.length)];
		if (!randomUser) continue;

		const filename = faker.system.fileName();

		mediaItems.push({
			objectKey: faker.string.uuid(),
			url: faker.image.url({ width: 1200, height: 800 }),
			alt: faker.lorem.sentence(),
			type: "IMAGE" as const,
			size: faker.number.int({ min: 100000, max: 5000000 }),
			mimeType: "image/jpeg",
			filename: filename,
			uploadedBy: randomUser.id,
		});
	}

	await prisma.media.createMany({
		data: mediaItems,
		skipDuplicates: true,
	});

	const createdMedia = await prisma.media.findMany();
	console.log(`✅ Created ${createdMedia.length} media items`);

	const posts = [];
	for (let i = 0; i < 100; i++) {
		const randomUser = users[Math.floor(Math.random() * users.length)];
		if (!randomUser) continue;

		const hasMedia = Math.random() > 0.3;
		const randomMedia = hasMedia && createdMedia.length > 0
			? createdMedia[Math.floor(Math.random() * createdMedia.length)]
			: null;

		posts.push({
			title: faker.lorem.sentence({ min: 3, max: 8 }),
			description: faker.lorem.paragraphs({ min: 1, max: 3 }),
			mediaId: randomMedia?.id,
			authorId: randomUser.id,
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
