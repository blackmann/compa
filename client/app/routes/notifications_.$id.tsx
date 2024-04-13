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
		case "post": {
			await prisma.notificationSubscriber.updateMany({
				data: { read: true },
				where: { notificationId, userId },
			});

			const post = await prisma.post.findFirst({
				where: { id: notification.entityId },
			});

			if (!post) {
				throw json({}, { status: 404 });
			}

			const path = []
			if (post.path) {
				path.push(post.path)
			}

			path.push(post.id)

			return redirect(`/discussions/${path.join('/')}`);
		}
	}
};
