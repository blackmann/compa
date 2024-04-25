import { ActionFunctionArgs, json } from "@remix-run/node";
import { checkMod } from "~/lib/check-mod";
import { prisma } from "~/lib/prisma.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		throw json({}, { status: 405 });
	}

	const mod = await checkMod(request);
	// [ ]: Track who approved a community. We can check through the notification for now

	const data = await request.json();
	const community = await prisma.community.findFirst({
		where: { handle: params.slug },
	});

	if (!community) {
		throw json({}, { status: 404 });
	}

	switch (data.action) {
		case "approve": {
			await prisma.community.update({
				where: { id: community.id },
				data: { status: "activated", members: 1 },
			});

			await prisma.communityMember.create({
				data: {
					communityId: community.id,
					role: "moderator",
					userId: community.createdById,
				},
			});

			const notification = await prisma.notification.create({
				data: {
					message: `Congratulations 🎉, your community (${community.name}) has been approved.`,
					entityId: community.id,
					entityType: "community",
					actorId: mod.id,
				},
			});

			await prisma.notificationSubscriber.create({
				data: {
					notificationId: notification.id,
					userId: community.createdById,
				},
			});
		}
	}

	return json(null);
};
