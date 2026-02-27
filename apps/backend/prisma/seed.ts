import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../src/config/env";
import { PrismaClient } from "./client/client";

/**
 * Genera contenido legal en formato JSON de Lexical
 */
function generateLexicalContent(caseData: {
	caseNumber: string;
	parties: string;
	legalBasis?: string | null;
}): string {
	const paragraphs = (count: number) => {
		return Array.from({ length: count }, () => ({
			type: "paragraph",
			children: [
				{
					type: "text",
					text: faker.lorem.paragraph(),
				},
			],
		}));
	};

	const heading = (level: 1 | 2 | 3, text: string) => ({
		type: "heading",
		tag: `h${level}`,
		children: [
			{
				type: "text",
				text,
			},
		],
	});

	const content = {
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			children: [
				heading(2, "Introducción"),
				...paragraphs(2),
				heading(2, "Antecedentes del caso"),
				{
					type: "paragraph",
					children: [
						{
							type: "text",
							format: 1, // bold
							text: `Expediente N°: ${caseData.caseNumber}`,
						},
					],
				},
				{
					type: "paragraph",
					children: [
						{
							type: "text",
							format: 1, // bold
							text: "Partes:",
						},
					],
				},
				{
					type: "paragraph",
					children: [
						{
							type: "text",
							text: caseData.parties,
						},
					],
				},
				...paragraphs(2),
				heading(2, "Hechos relevantes"),
				...paragraphs(3),
				heading(2, "Fundamentos jurídicos"),
				heading(3, "Base legal aplicada"),
				{
					type: "paragraph",
					children: [
						{
							type: "text",
							text: caseData.legalBasis || faker.lorem.sentence(),
						},
					],
				},
				...paragraphs(3),
				heading(3, "Análisis del tribunal"),
				...paragraphs(2),
				heading(2, "Ratio decidendi"),
				...paragraphs(1),
				heading(2, "Fallo"),
				...paragraphs(1),
				heading(2, "Implicancias y conclusiones"),
				...paragraphs(2),
				heading(2, "Comentarios finales"),
				...paragraphs(1),
			],
			direction: null,
		},
	};

	return JSON.stringify(content);
}

const adapter = new PrismaPg({
	connectionString: DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const legalCategories = [
	{
		name: "Derecho Civil",
		slug: "derecho-civil",
		description: "Casos y análisis de derecho civil, obligaciones, contratos y responsabilidad civil",
	},
	{
		name: "Derecho Penal",
		slug: "derecho-penal",
		description: "Jurisprudencia en materia penal, delitos y sanciones",
	},
	{
		name: "Derecho Constitucional",
		slug: "derecho-constitucional",
		description: "Análisis constitucional, derechos fundamentales y control de constitucionalidad",
	},
	{
		name: "Derecho Laboral",
		slug: "derecho-laboral",
		description: "Casos laborales, derechos del trabajador y seguridad social",
	},
	{
		name: "Derecho Administrativo",
		slug: "derecho-administrativo",
		description: "Contencioso administrativo y actos de la administración pública",
	},
	{
		name: "Derecho Comercial",
		slug: "derecho-comercial",
		description: "Derecho mercantil, sociedades y empresarial",
	},
	{
		name: "Derecho de Familia",
		slug: "derecho-familia",
		description: "Casos de familia, matrimonio, divorcio y sucesiones",
	},
	{
		name: "Derecho Tributario",
		slug: "derecho-tributario",
		description: "Materia tributaria, fiscal e impuestos",
	},
	{
		name: "Derecho Ambiental",
		slug: "derecho-ambiental",
		description: "Protección del medio ambiente y recursos naturales",
	},
];

const legalTags = [
	"sentencia",
	"casación",
	"amparo",
	"habeas-corpus",
	"habeas-data",
	"acción-popular",
	"jurisprudencia-vinculante",
	"precedente",
	"pleno-casatorio",
	"corte-suprema",
	"tribunal-constitucional",
	"responsabilidad-civil",
	"contratos",
	"derechos-humanos",
	"debido-proceso",
	"tutela-procesal",
	"indemnización",
	"daños-perjuicios",
	"nulidad-acto",
	"despido-arbitrario",
];

const courtsData = [
	{
		name: "Corte Suprema de Justicia de la República",
		type: "SUPREMA" as const,
		jurisdiction: "NACIONAL" as const,
		description: "Máximo órgano jurisdiccional del país",
	},
	{
		name: "Tribunal Constitucional",
		type: "CONSTITUCIONAL" as const,
		jurisdiction: "NACIONAL" as const,
		description: "Órgano supremo de interpretación y control de constitucionalidad",
	},
	{
		name: "Corte Superior de Lima",
		type: "SUPERIOR" as const,
		jurisdiction: "REGIONAL" as const,
		description: "Corte superior del distrito judicial de Lima",
	},
	{
		name: "Corte Superior de Arequipa",
		type: "SUPERIOR" as const,
		jurisdiction: "REGIONAL" as const,
		description: "Corte superior del distrito judicial de Arequipa",
	},
	{
		name: "Corte Superior de Cusco",
		type: "SUPERIOR" as const,
		jurisdiction: "REGIONAL" as const,
		description: "Corte superior del distrito judicial de Cusco",
	},
	{
		name: "Juzgado Especializado Civil de Lima",
		type: "ESPECIALIZADA" as const,
		jurisdiction: "LOCAL" as const,
		description: "Primera instancia en materia civil",
	},
	{
		name: "Juzgado Especializado Penal de Lima",
		type: "ESPECIALIZADA" as const,
		jurisdiction: "LOCAL" as const,
		description: "Primera instancia en materia penal",
	},
	{
		name: "Juzgado de Familia de Lima",
		type: "ESPECIALIZADA" as const,
		jurisdiction: "LOCAL" as const,
		description: "Primera instancia en materia de familia",
	},
	{
		name: "Juzgado Laboral de Lima",
		type: "ESPECIALIZADA" as const,
		jurisdiction: "LOCAL" as const,
		description: "Primera instancia en materia laboral",
	},
];

async function main() {
	console.log("🏛️  Starting legal blog seed...");

	// Create users (legal authors)
	let users = await prisma.user.findMany();

	if (users.length === 0) {
		console.log("👤 Creating legal authors...");

		const legalAuthors = [];
		for (let i = 0; i < 5; i++) {
			legalAuthors.push({
				id: faker.string.uuid(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
				emailVerified: true,
				image: faker.image.avatar(),
				bio: `Abogado especializado en ${legalCategories[i % legalCategories.length]?.name}`,
			});
		}

		await prisma.user.createMany({
			data: legalAuthors,
			skipDuplicates: true,
		});

		users = await prisma.user.findMany();
		console.log(`✅ Created ${users.length} legal authors`);
	} else {
		console.log(`✅ Found ${users.length} existing users`);
	}

	// Create categories
	await prisma.category.deleteMany({});
	console.log("📚 Creating legal categories...");

	const categories = await prisma.category.createManyAndReturn({
		data: legalCategories,
	});
	console.log(`✅ Created ${categories.length} categories`);

	// Create tags
	await prisma.tag.deleteMany({});
	console.log("🏷️  Creating legal tags...");

	const tagsData = legalTags.map((tag) => ({
		name: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, " "),
		slug: tag,
	}));

	const tags = await prisma.tag.createManyAndReturn({
		data: tagsData,
	});
	console.log(`✅ Created ${tags.length} tags`);

	// Create courts
	await prisma.court.deleteMany({});
	console.log("⚖️  Creating courts...");

	const createdCourts = await prisma.court.createManyAndReturn({
		data: courtsData,
	});
	console.log(`✅ Created ${createdCourts.length} courts`);

	// Create legal cases
	await prisma.legalCase.deleteMany({});
	console.log("📋 Creating legal cases...");

	const caseTypes = [
		"CIVIL",
		"PENAL",
		"CONSTITUCIONAL",
		"LABORAL",
		"ADMINISTRATIVO",
		"COMERCIAL",
		"FAMILIA",
		"TRIBUTARIO",
		"AMBIENTAL",
	] as const;

	const verdicts = ["FUNDADA", "INFUNDADA", "IMPROCEDENTE", "NULA", "PROCEDENTE EN PARTE"];

	const caseTitles = [
		"Impugnación de Acto Administrativo",
		"Indemnización por Daños y Perjuicios",
		"Amparo por Vulneración de Derechos Fundamentales",
		"Nulidad de Contrato",
		"Divorcio por Causal",
		"Despido Arbitrario",
		"Obligación de Dar Suma de Dinero",
		"Prescripción Adquisitiva de Dominio",
		"Desalojo por Ocupación Precaria",
		"Reposición Laboral",
		"Habeas Corpus",
		"Alimentos",
		"Filiación Extramatrimonial",
		"Acción Popular",
		"Casación por Infracción Normativa",
	];

	const legalBases = [
		"Código Civil artículos 1321, 1362, 1985",
		"Constitución Política artículos 2.2, 139.3",
		"Código Procesal Civil artículos 486, 546",
		"Ley N° 27444 - Ley del Procedimiento Administrativo General",
		"Código Penal artículos 12, 45, 46",
		"Ley N° 29497 - Nueva Ley Procesal del Trabajo",
		"Código Civil artículos 333, 345, 348 (Divorcio)",
		"Código Civil artículos 415, 472, 481 (Alimentos)",
		"Código Civil artículos 950, 951, 952 (Prescripción Adquisitiva)",
		"Código Civil artículos 1549, 1550, 1551 (Contratos)",
	];

	const legalCases = [];
	for (let i = 0; i < 40; i++) {
		const court = createdCourts[Math.floor(Math.random() * createdCourts.length)];
		if (!court) continue;

		const caseType = caseTypes[Math.floor(Math.random() * caseTypes.length)];
		const caseTitle = caseTitles[Math.floor(Math.random() * caseTitles.length)];
		const plaintiff = faker.person.fullName();
		const defendant = faker.person.fullName();

		legalCases.push({
			caseNumber: `${String(faker.number.int({ min: 100, max: 999 })).padStart(3, "0")}-${faker.number.int({ min: 2020, max: 2026 })}-${faker.number.int({ min: 0, max: 99 })}`,
			caseName: `${plaintiff} vs ${defendant}`,
			summary: `Caso sobre ${caseTitle?.toLowerCase()}. ${faker.lorem.sentence({ min: 10, max: 20 })}`,
			parties: `DEMANDANTE: ${plaintiff}\nDEMANDADO: ${defendant}\nTERCERO INTERVINIENTE: ${faker.datatype.boolean() ? faker.person.fullName() : null}`,
			plaintiff,
			defendant,
			judges: faker.person.fullName(),
			verdict: verdicts[Math.floor(Math.random() * verdicts.length)],
			legalBasis: legalBases[Math.floor(Math.random() * legalBases.length)],
			caseDate: faker.date.between({ from: "2020-01-01", to: "2025-12-31" }),
			resolutionDate: faker.date.between({ from: "2021-01-01", to: "2026-02-26" }),
			courtId: court.id,
			jurisdiction: court.jurisdiction,
			caseType,
		});
	}

	const createdCases = await prisma.legalCase.createManyAndReturn({
		data: legalCases,
	});
	console.log(`✅ Created ${createdCases.length} legal cases`);

	// Create media
	await prisma.media.deleteMany({});
	console.log("🖼️  Creating media...");

	const mediaItems = [];
	for (let i = 0; i < 30; i++) {
		const randomUser = users[Math.floor(Math.random() * users.length)];
		if (!randomUser) continue;

		mediaItems.push({
			objectKey: faker.string.uuid(),
			url: faker.image.url({ width: 1200, height: 800 }),
			alt: faker.lorem.sentence(),
			type: "IMAGE" as const,
			size: faker.number.int({ min: 100000, max: 5000000 }),
			mimeType: "image/jpeg",
			filename: `legal-image-${i}.jpg`,
			uploadedBy: randomUser.id,
		});
	}

	const createdMedia = await prisma.media.createManyAndReturn({
		data: mediaItems,
	});
	console.log(`✅ Created ${createdMedia.length} media items`);

	// Create articles
	await prisma.article.deleteMany({});
	console.log("📰 Creating legal articles...");

	const articleTitleTemplates = [
		"Análisis de la sentencia",
		"Precedente vinculante en",
		"Comentarios al caso",
		"Implicancias jurídicas del fallo",
		"Nuevo criterio jurisprudencial sobre",
		"Pleno Casatorio:",
		"Interpretación constitucional en",
		"Amparo constitucional:",
		"Casación:",
		"Jurisprudencia relevante sobre",
	];

	for (let i = 0; i < 50; i++) {
		const randomUser = users[Math.floor(Math.random() * users.length)];
		const randomCases = faker.helpers.arrayElements(createdCases, faker.number.int({ min: 1, max: 3 }));
		const randomMedia = createdMedia[Math.floor(Math.random() * createdMedia.length)];
		const randomCategories = faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: 2 }));
		const randomTags = faker.helpers.arrayElements(tags, faker.number.int({ min: 3, max: 6 }));

		if (!randomUser || randomCases.length === 0) continue;

		const mainCase = randomCases[0];
		if (!mainCase) continue;

		const titleTemplate = articleTitleTemplates[Math.floor(Math.random() * articleTitleTemplates.length)];
		const title = `${titleTemplate} ${faker.helpers.arrayElement([
			mainCase.caseNumber,
			mainCase.caseName,
			randomCategories[0]?.name || "derecho",
			faker.helpers.arrayElement([
				"responsabilidad civil",
				"debido proceso",
				"derechos fundamentales",
				"nulidad de acto jurídico",
			]),
		])}`;

		const slug =
			title
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-")
				.substring(0, 90) + `-${i}`;

		const content = generateLexicalContent({
			caseNumber: mainCase.caseNumber,
			parties: mainCase.parties || "",
			legalBasis: mainCase.legalBasis,
		});

		const status = faker.helpers.weightedArrayElement([
			{ weight: 7, value: "PUBLISHED" as const },
			{ weight: 2, value: "DRAFT" as const },
			{ weight: 1, value: "ARCHIVED" as const },
		]);

		await prisma.article.create({
			data: {
				title,
				slug,
				excerpt: `${faker.lorem.sentence({ min: 10, max: 20 })} ${faker.lorem.sentence({ min: 8, max: 15 })}`,
				content,
				status,
				publishedAt: status === "PUBLISHED" ? faker.date.between({ from: "2023-01-01", to: new Date() }) : null,
				authorId: randomUser.id,
				featuredImageId: faker.datatype.boolean({ probability: 0.7 }) ? randomMedia?.id : undefined,
				views: status === "PUBLISHED" ? faker.number.int({ min: 50, max: 10000 }) : 0,
				readingTimeMin: faker.number.int({ min: 5, max: 20 }),
				categories: {
					connect: randomCategories.map((cat) => ({ id: cat.id })),
				},
				tags: {
					connect: randomTags.map((tag) => ({ id: tag.id })),
				},
				legalCases: {
					connect: randomCases.map((lcase) => ({ id: lcase.id })),
				},
			},
		});
	}

	const createdArticles = await prisma.article.findMany();
	console.log(`✅ Created ${createdArticles.length} legal articles`);

	console.log("\n🎉 Legal blog seed completed successfully!");
	console.log(`📊 Summary:`);
	console.log(`   - ${users.length} authors`);
	console.log(`   - ${categories.length} categories`);
	console.log(`   - ${tags.length} tags`);
	console.log(`   - ${createdCourts.length} courts`);
	console.log(`   - ${createdCases.length} legal cases`);
	console.log(`   - ${createdMedia.length} media files`);
	console.log(`   - ${createdArticles.length} articles`);
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
