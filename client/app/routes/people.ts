import { LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const post = new URL(request.url).searchParams.get("postId");
	if (!post) {
		return new Response("Missing post query param", { status: 400 });
	}

	const postId = Number(post);

	const people = await prisma.user.findMany({
		where: {
			Post: {
				some: { OR: [{ id: postId }, { parentId: postId }], deleted: false },
			},
		},
	});

	return json({ people });
};
