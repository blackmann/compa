import { ActionFunctionArgs, json } from "@remix-run/node";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
	if (request.method !== "PATCH") {
		return json({ message: "Method not allowed" }, { status: 405 });
	}

	const postId = Number(params.post);
	const userId = await checkAuth(request);

	const data = await request.json();

	const existingVote = await prisma.vote.findFirst({
		where: { postId, userId },
	});

	if (existingVote) {
		await prisma.vote.update({
			where: { id: existingVote.id },
			data: { up: Boolean(data.up) },
		});
	} else {
		await prisma.vote.create({
			data: {
				up: Boolean(data.up),
				userId: userId,
				postId,
			},
		});
	}

	const upvotes = await prisma.vote.count({ where: { postId, up: true } });
	const downvotes = await prisma.vote.count({ where: { postId, up: false } });

	await prisma.post.update({
		where: { id: postId },
		data: { upvotes, downvotes },
	});

	return json({});
};
