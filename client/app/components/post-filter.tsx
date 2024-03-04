import React from "react";
import { DEFAULT_SELECTIONS, Selections, TagInput } from "./tag-input";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import { ParsedQs } from "qs";

interface Props {
	label: React.ReactNode;
	path: string;
}

function PostFilter({ label, path }: Props) {
	const [filters, setFilters] = React.useState<Selections>(DEFAULT_SELECTIONS);
	const navigate = useNavigate();
	const { queryParams = {} } = useLoaderData<{ queryParams: ParsedQs }>();
	const location = useLocation();

	const filterCount = React.useMemo(
		() => Object.values(filters).flat().length,
		[filters],
	);

	const q = React.useMemo(
		() =>
			Object.entries(filters)
				.filter((e) => e[1].length > 0)
				.flatMap(([id, values]) =>
					values.map((v, i) => `tags[${id}]=${encodeURIComponent(v)}`),
				)
				.join("&"),
		[filters],
	);

	React.useEffect(() => {
		const tags = queryParams.tags;
		if (!tags) {
			return;
		}

		const currentTags = Object.fromEntries(
			Object.entries(tags).map(([k, v]) => [k, Array.isArray(v) ? v : [v]]),
		);

		setFilters({ ...DEFAULT_SELECTIONS, ...currentTags });
	}, [queryParams]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			const to = [path, q].join("?");
			const from = `${location.pathname}${location.search || "?"}`;

			if (from === to) {
				return;
			}

			navigate(to);
		}, 50);

		return () => clearTimeout(timeout);
	}, [path, q, navigate, location.pathname, location.search]);

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
					{label}{" "}
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
