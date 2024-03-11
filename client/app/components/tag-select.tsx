import { SelectionId, Selections } from "./tag-input";

interface Props {
	tags: Selections;
	onRemove?: (id: SelectionId, value: string) => void;
}

function TagSelect({ onRemove, tags }: Props) {
	const flatTags = Object.entries(tags).flatMap(([id, values]) =>
		values.map((v) => [id, v]),
	);

	if (!flatTags.length) {
		return null
	}

	return (
		<ul className="flex mb-1 gap-1 flex-wrap">
			{flatTags.map(([id, tag]) => (
				<li
					key={`${id}:${tag}`}
					className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2 inline-flex items-center gap-1 font-medium"
				>
					{tag}{" "}
					<button
						className="i-lucide-x text-secondary"
						type="button"
						title={`Remove ${id}:${tag}`}
						onClick={() => onRemove?.(id as SelectionId, tag)}
					/>
				</li>
			))}
		</ul>
	);
}

export { TagSelect };
