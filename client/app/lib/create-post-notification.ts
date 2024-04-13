import { prisma } from "./prisma.server";

interface Options {
	message: string;
	actorId: number;
	entityId: number;
}

async function createPostNotification({ message, actorId, entityId }: Options) {
	const suscribers = await prisma.post.findMany({
		where: {
			OR: [{ id: entityId }, { parentId: entityId }],
			AND: { userId: { not: actorId } },
		},
		distinct: ["userId"],
		select: { userId: true },
	});

	const notification = await prisma.notification.create({
		data: {
			message,
			actorId,
			entityId,
			entityType: "post",
		},
	});

	await Promise.allSettled(
		suscribers?.map(async (suscriber) => {
			await prisma.notificationSubscriber.create({
				data: {
					userId: suscriber.userId,
					notificationId: notification.id,
				},
			});
		}),
	);
}

export { createPostNotification };
