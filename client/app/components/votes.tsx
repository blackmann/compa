import type { Prisma } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import type { Jsonify } from "type-fest";
import { useGlobalCtx } from "~/lib/global-ctx";

type Post = Prisma.PostGetPayload<{ include: { user: true } }> & {
	vote?: boolean;
};

interface Props {
	post: Post | Jsonify<Post>;
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
				className={clsx(" text-secondary disabled:opacity-50", {
					"!dark:text-white !text-zinc-900": post.vote,
				})}
				type="button"
				onClick={handleUpvote}
				disabled={!user}
			>
				<div className="i-lucide-triangle" />
			</button>

			<span className="font-medium text-sm">
				{post.upvotes - post.downvotes}
			</span>

			<button
				className={clsx("text-secondary disabled:opacity-50", {
					"!dark:text-white !text-zinc-900": post.vote === false,
				})}
				type="button"
				onClick={handleDownvote}
				disabled={!user}
			>
				<div className="i-lucide-triangle rotate-180" />
			</button>
		</>
	);
}

export { Votes };
