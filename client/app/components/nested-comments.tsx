import { Prisma } from "@prisma/client";
import { useComments } from "~/lib/use-comments";
import { PostItem } from "./post-item";

interface Props {
	post: Prisma.PostGetPayload<{ include: { user: true } }>;
}

function NestedComments({ post }: Props) {
	const comments = useComments({ postId: post.id });

	return comments.map((comment) => (
		<PostItem post={comment} level={2} key={comment.id} />
	));
}

export { NestedComments };
