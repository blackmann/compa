import { prisma } from "./prisma.server";

async function getModerators() {
	return await prisma.user.findMany({
		where: { role: "moderator" },
		select: { id: true },
	});
}

export { getModerators };
