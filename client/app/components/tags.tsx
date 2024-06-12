import type { Post } from "@prisma/client";
import clsx from "clsx";
import React from "react";

interface Props {
	className?: string;
	tags: Post['tags'];
}

function Tags({ className, tags }: Props) {
	const parsedTags = React.useMemo(() => {
		const parsed =
			(JSON.parse(tags || "null") as string[] | undefined) || [];
		return parsed.map((str) => {
			const [id, ...parts] = str.split(":");
			return [id, parts.join(":")];
		});
	}, [tags]);

	if (!parsedTags.length) {
		return null;
	}

	return (
		<ul
			className={clsx(
				"flex text-secondary font-medium flex-wrap gap-y-1",
				className,
			)}
		>
			{parsedTags.map(([id, value]) => (
				<li
					key={`${id}:${value}`}
					className="bg-zinc-100 dark:bg-neutral-800 [&:not(:last-child)]:border-e dark:border-neutral-700 px-2 text-sm inline-flex items-center gap-1 whitespace-nowrap first:rounded-s-lg last:rounded-e-lg"
				>
					{value}
				</li>
			))}
		</ul>
	);
}

export { Tags };
