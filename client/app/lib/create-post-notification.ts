import type { Post, User } from "@prisma/client";
import { prisma } from "./prisma.server";
import { renderStripped } from "./render-stripped.server";
import { MENTION_REGEX } from "./username-regex";

async function createPostNotification(post: Post, author: User) {
	if (!post.parentId) return;

	const op = (await prisma.post.findFirst({
		where: { id: post.parentId },
	})) as Post;

	if (op.userId === author.id) {
		return;
	}

	const summary = await renderStripped(op.content, 42);
	const message = [`@${author?.username}`];

	if (op.path) {
		message.push("replied to your comment:");
	} else {
		message.push("commented on:");
	}

	message.push(summary);

	const data = {
		message: message.join(" "),
		actorId: author.id,
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

	const usernames = post.content.match(MENTION_REGEX) || [];
	const cleaned = usernames.map((u) => u.replace(/^@/, "").trim());
	const mentions = cleaned.filter((username) => username !== author.username);

	const mentionedUsers = await prisma.user.findMany({
		where: {
			username: { in: mentions },
			id: { not: op.userId },
		},
		select: { id: true },
	});

	const type = op.path ? "comment" : "post";
	const mentionsNotification = await prisma.notification.create({
		data: {
			message: `@${author.username} mentioned you in a ${type}: ${summary}`,
			actorId: author.id,
			entityId: post.id,
			entityType: "post",
		},
	});

	for (const mentionedUser of mentionedUsers) {
		await prisma.notificationSubscriber.create({
			data: {
				userId: mentionedUser.id,
				notificationId: mentionsNotification.id,
			},
		});
	}
}

export { createPostNotification };
