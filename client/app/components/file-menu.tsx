import type { Prisma } from "@prisma/client";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import type { Jsonify } from "type-fest";
import type { loader } from "~/root";
import { DropdownMenu } from "./dropdown-menu";

type RepositoryFile = Prisma.RepositoryGetPayload<{ include: { user: true } }>;

interface Props {
	file: RepositoryFile | Jsonify<RepositoryFile>;
}

function FileMenu({ file }: Props) {
	const { user } = useRouteLoaderData<typeof loader>("root") || {};
	const fetcher = useFetcher();

	if (user?.id !== file.userId) {
		return <div className="size-8" />;
	}

	const menuItems = [
		{ id: "delete-file", title: "Delete file", icon: "i-lucide-trash" },
	];

	function handleClick(actionId: string) {
		if (actionId === "delete-file") {
			const yes = confirm(
				"Are you sure you want to delete this file? This cannot be undone.",
			);

			if (yes) {
				fetcher.submit("", {
					method: "DELETE",
					action: `/library/${file.id}`,
				});
			}
		}
	}

	return <DropdownMenu items={menuItems} onItemClick={handleClick} />;
}

export { FileMenu };
