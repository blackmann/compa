import { Prisma } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useGlobalCtx } from "~/lib/global-ctx";

interface Props {
	post: Prisma.PostGetPayload<{ include: { user: true } }>;
}

function Votes({ post }: Props) {
	const fetcher = useFetcher();
	const { user } = useGlobalCtx();

	async function vote(up: boolean) {
		fetcher.submit(JSON.stringify({ up }), {
			method: "PATCH",
			action: `/vote/${post.id}`,
			encType: "application/json",
		});
	}

	async function handleUpvote(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();

		await vote(true);
	}

	async function handleDownvote(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();

		await vote(false);
	}

	return (
		<>
			<button
				className="i-lucide-triangle text-secondary"
				type="button"
				onClick={handleUpvote}
				disabled={!user}
			/>

			<span className="font-medium text-sm">
				{post.upvotes - post.downvotes}
			</span>

			<button
				className="i-lucide-triangle rotate-180 text-secondary"
				type="button"
				onClick={handleDownvote}
				disabled={!user}
			/>
		</>
	);
}

export { Votes };
