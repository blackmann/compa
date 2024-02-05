import { Prisma, PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
declare global {
	var __db: ReturnType<typeof installMiddleware> | undefined;
}

if (process.env.NODE_ENV === "production") {
	prisma = installMiddleware(new PrismaClient());
	prisma.$connect();
} else {
	if (!global.__db) {
		global.__db = installMiddleware(new PrismaClient());
		global.__db.$connect();
	}
	prisma = global.__db;
}

function installMiddleware(prisma: PrismaClient) {
	return prisma.$extends(
		Prisma.defineExtension({
			query: {
				post: {
					async delete({ args }) {
						return prisma.post.update({ ...args, data: { deleted: true } });
					},
					async deleteMany({ args }) {
						return prisma.post.updateMany({ ...args, data: { deleted: true } });
					},
					async findMany({ args }) {
						return prisma.post.findMany({
							...args,
							where: { ...args.where, deleted: false },
						});
					},
					async findFirst({ args }) {
						return prisma.post.findFirst({
							...args,
							where: { ...args.where, deleted: false },
						});
					},
				},
			},
		}),
	);
}

export { prisma };
