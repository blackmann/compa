import { Post, User } from "@prisma/client";
import { prisma } from "./prisma.server";
import { renderStripped } from "./render-stripped.server";

async function createPostNotification(post: Post, user: User) {
	if (!post.parentId) return;

	const op = (await prisma.post.findFirst({
		where: { id: post.parentId },
	})) as Post;

	if (op.userId === user.id) {
		return
	}

	const summary = await renderStripped(op.content, 42);
	const message = [`@${user?.username}`];

	if (op.path) {
		message.push("replied to your comment:");
	} else {
		message.push("commented on:");
	}

	message.push(summary);

	const data = {
		message: message.join(" "),
		actorId: user.id,
		entityId: post.id,
		entityType: "post",
	};

	const notification = await prisma.notification.create({
		data,
	});

	await prisma.notificationSubscriber.create({
		data: {
			userId: op.userId,
			notificationId: notification.id,
		},
	});
}

export { createPostNotification };
