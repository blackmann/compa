import { Post } from "@prisma/client";
import { checkAuth } from "./check-auth";
import { prisma } from "./prisma.server";

async function includeVotes(
	posts: (Post & { vote?: boolean })[],
	request: Request,
) {
	try {
		const userId = await checkAuth(request);

		const votes = userId
			? await prisma.vote.findMany({
					where: { userId, postId: { in: posts.map(({ id }) => id) } },
					select: { up: true, postId: true },
			  })
			: [];

		const postVoteIndex: Record<number, boolean> = {};
		for (const vote of votes) {
			postVoteIndex[vote.postId] = vote.up;
		}

		for (const post of posts) {
			post.vote = postVoteIndex[post.id];
		}
	} catch {
		//
	}

	return posts;
}

export { includeVotes };
