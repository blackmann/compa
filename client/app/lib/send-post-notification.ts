import { prisma } from "./prisma.server";

type sendPostNotificationType = {
	message: string;
	actorId: number;
	entityId: number;
	entityType: string;
};

async function sendPostNotification({
	message,
	actorId,
	entityId,
	entityType,
}: sendPostNotificationType) {
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
			entityType,
		},
	});

	suscribers?.map(async (suscriber) => {
		await prisma.notificationSuscribers.create({
			data: {
				userId: suscriber.userId,
				notificationId: notification.id,
			},
		});
	});
}

export { sendPostNotification };
