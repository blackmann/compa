import { LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const postId = new URL(request.url).searchParams.get("postId");

	if (!postId) {
		return new Response("Missing postId", { status: 400 });
	}

	const comments = await prisma.post.findMany({
		where: { parentId: Number(postId) },
		include: { user: true },
	});

	return json({ comments });
};
