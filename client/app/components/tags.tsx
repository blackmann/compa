import { Post } from "@prisma/client";
import React from "react";

interface Props {
	post: Post;
}

function Tags({ post }: Props) {
	const tags = React.useMemo(() => {
		const parsed =
			(JSON.parse(post.tags || "null") as string[] | undefined) || [];
		return parsed.map((str) => {
			const [id, ...parts] = str.split(":");
			return [id, parts.join(":")];
		});
	}, [post]);

	return (
		<ul className="flex text-secondary font-medium">
			{tags.map(([id, value]) => (
				<li
					key={`${id}:${value}`}
					className="bg-zinc-100 [&:not(:last-child)]:border-e px-2 text-sm inline-flex items-center gap-1 first:rounded-s-lg last:rounded-e-lg"
				>
					{value}
				</li>
			))}
		</ul>
	);
}

export { Tags };
