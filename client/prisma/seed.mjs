import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
	"Others",
	"Appliances",
	"Clothing & Outfit",
	"Cosmetics",
	"Devices",
	"Food",
	"Service",
];

try {
	for (const category of categories) {
		if (!(await prisma.category.count({ where: { title: category } }))) {
			await prisma.category.create({ data: { title: category } });
		}
	}
} catch (err) {
	console.error("error", err);
}

await prisma.$disconnect();
