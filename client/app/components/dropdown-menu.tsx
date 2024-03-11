import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import React from "react";

interface Props {
	items: { id: string; title: string; icon?: string }[];
	onItemClick?: (id: string) => void;
}

function DD({ items, onItemClick }: Props) {
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
					{items.map((item, i) => (
						<React.Fragment key={item.id}>
							<DropdownMenu.Item
								className="px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-neutral-800 flex gap-2 items-center cursor-pointer"
								onClick={(e) => e.stopPropagation()}
								onSelect={() => onItemClick?.(item.id)}
							>
								<span className={clsx("inline-block opacity-50", item.icon)} />{" "}
								{item.title}
							</DropdownMenu.Item>
							{i !== items.length - 1 && (
								<DropdownMenu.Separator className="border-t ms-8 me-2" />
							)}
						</React.Fragment>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

export { DD as DropdownMenu };
