import { Prisma } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { useGlobalCtx } from "~/lib/global-ctx";

interface Props {
	post: Prisma.PostGetPayload<{ include: { user: true } }>;
}

function PostMenu({ post }: Props) {
	const { user } = useGlobalCtx();
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
				fetcher.submit('', {
					method: "DELETE",
					action: `/discussions/${post.id}`,
				});
			}
		}
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					className="text-secondary rounded-full size-8 relative inline-flex justify-center items-center hover:bg-zinc-200 dark:hover:bg-neutral-700"
					aria-label="Customise options"
					type="button"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<div className="i-lucide-more-horizontal text-lg" />
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					align="end"
					side="bottom"
					className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-lg p-1 shadow"
				>
					{menuItems.map((item, i) => (
						<>
							<DropdownMenu.Item
								className="px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-neutral-800 flex gap-2 items-center cursor-pointer"
								key={item.id}
								onClick={(e) => e.stopPropagation()}
								onSelect={() => handleClick(item.id)}
							>
								<span className={clsx("inline-block opacity-50", item.icon)} />{" "}
								{item.title}
							</DropdownMenu.Item>
							{i !== menuItems.length - 1 && (
								<DropdownMenu.Separator className="border-t ms-8 me-2" />
							)}
						</>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

export { PostMenu };
