import { Media } from "@prisma/client";
import { prisma } from "./prisma.server";

async function createPost(data: Record<string, any>, userId: number) {
	const media = data.media as Omit<Media, "postId">[];

	const post = await prisma.post.create({
		data: {
			content: data.content,
			userId,
			upvotes: 1,
			parentId: data.parentId,
			people: 1,
			tags: data.tags
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

  return post
}

export { createPost };
