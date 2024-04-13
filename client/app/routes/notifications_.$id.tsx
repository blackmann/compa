import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const userId = await checkAuth(request);

	const notificationId = Number(params.id as string);

	const notification = await prisma.notification.findFirst({
		where: { id: notificationId },
	});

	if (!notification) {
		throw new Response("Not found", { status: 404 });
	}

	switch (notification.entityType) {
		case "post":
			await prisma.notificationSuscribers.updateMany({
				data: { read: true },
				where: { notificationId, userId },
			});

			return redirect(`/discussions/${notification.entityId}`);
	}
};