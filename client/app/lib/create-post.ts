import { Media } from "@prisma/client";
import { prisma } from "./prisma.server";

async function createPost(data: Record<string, any>, userId: number) {
	const media = data.media as Omit<Media, "postId">[];

	const path = await getPath(data.parentId);

	const post = await prisma.post.create({
		data: {
			content: data.content,
			userId,
			upvotes: 1,
			parentId: data.parentId,
			people: 1,
			tags: data.tags,
			path,
			communityId: data.communityId,
		},
	});

	await Promise.all(
		media.map((item) =>
			prisma.media.create({ data: { ...item, postId: post.id } }),
		),
	);

	await prisma.vote.create({
		data: {
			postId: post.id,
			userId,
			up: true,
		},
	});

	return post;
}

async function getPath(id?: number | null): Promise<string | undefined> {
	if (!id) {
		return;
	}

	const parent = await prisma.post.findFirst({
		where: { id },
		select: { parentId: true },
	});

	return [await getPath(parent?.parentId), id].filter(Boolean).join("/");
}

export { createPost };
