import type { Prisma } from "@prisma/client";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import type { Jsonify } from "type-fest";
import type { loader } from "~/root";
import { DropdownMenu } from "./dropdown-menu";

type Post = Prisma.PostGetPayload<{ include: { user: true } }>;

interface Props {
	post: Post | Jsonify<Post>;
}

function PostMenu({ post }: Props) {
	const { user } = useRouteLoaderData<typeof loader>("root") || {};
	const fetcher = useFetcher();

	if (user?.id !== post.userId) {
		return <div className="size-8" />;
	}

	const menuItems = [
		{ id: "delete-post", title: "Delete post", icon: "i-lucide-trash" },
	];

	function handleClick(actionId: string) {
		if (actionId === "delete-post") {
			const yes = confirm(
				"Are you sure you want to delete this post? This cannot be undone.",
			);

			if (yes) {
				fetcher.submit("", {
					method: "DELETE",
					action: `/discussions/${post.id}`,
				});
			}
		}
	}

	return <DropdownMenu items={menuItems} onItemClick={handleClick} />;
}

export { PostMenu };
