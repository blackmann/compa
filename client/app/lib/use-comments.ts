import { Prisma } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import React from "react";

interface Args {
	postId: number;
}

function useComments({ postId }: Args) {
	const [comments, setComments] = React.useState<
		Prisma.PostGetPayload<{ include: { user: true } }>[]
	>([]);

	const fetcher = useFetcher();

	React.useEffect(() => {
		fetcher.load(`/comments?postId=${postId}`);
	}, [fetcher.load, postId]);

	React.useEffect(() => {
		if (fetcher.data) {
			setComments(fetcher.data.comments);
		}
	}, [fetcher.data]);

	return { comments, status: fetcher.state };
}

export { useComments };
