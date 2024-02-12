import { Prisma } from "@prisma/client";
import { useComments } from "~/lib/use-comments";
import { PostItem } from "./post-item";
import React from "react";

interface Props {
	post: Prisma.PostGetPayload<{ include: { user: true } }>;
}

function NestedComments({ post }: Props) {
	const comments = useComments({ postId: post.id });

	return comments.map((comment, i) => (
		<div className="mb-2" key={comment.id}>
			<PostItem post={comment} level={2} />
			{i < comments.length - 1 && (
				<hr className="me-2 ms-8 dark:border-neutral-800" />
			)}
		</div>
	));
}

export { NestedComments };
