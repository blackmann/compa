import React from "react";
import { DEFAULT_SELECTIONS, Selections, TagInput } from "./tag-input";
import { useNavigate } from "@remix-run/react";
import clsx from "clsx";

function PostFilter() {
	const [filters, setFilters] = React.useState<Selections>(DEFAULT_SELECTIONS);
	const navigate = useNavigate();

	const filterCount = React.useMemo(
		() => Object.values(filters).flat().length,
		[filters],
	);

	React.useEffect(() => {
		const q = Object.entries(filters)
			.filter((e) => e[1].length > 0)
			.flatMap(([id, values]) =>
				values.map((v, i) => `tags[${id}]=${encodeURIComponent(v)}`),
			)
			.join("&");

		navigate(`/discussions?${q}`);
	}, [filters, navigate]);

	return (
		<div className="flex justify-between mb-2">
			<TagInput
				className={clsx("!w-auto !h-auto rounded-lg", {
					"!bg-blue-600 text-white": filterCount > 0,
				})}
				value={filters}
				onDone={setFilters}
			>
				<div className="flex gap-2 items-center">
					<div className="inline-block i-lucide-list-filter opacity-60" />{" "}
					Filter discussions{" "}
					{filterCount > 0 && (
						<span className="px-2 rounded-full bg-blue-800 text-sm">
							{filterCount}
						</span>
					)}
				</div>
			</TagInput>
		</div>
	);
}

export { PostFilter };
