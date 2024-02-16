import React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Input } from "./input";
import { useTagCourses } from "~/lib/use-tag-courses";
import { useTagProgrammes } from "~/lib/use-tag-programmes";
import { Link } from "@remix-run/react";
import { UseData } from "~/lib/tag-use-data";
import clsx from "clsx";

// TODO: Add custom
type SelectionStage = "type" | "course" | "programme" | "level";
type SelectionId = Exclude<SelectionStage, "type">;
type Selections = Record<SelectionId, string[]>;

const TAG_LIMIT = 4;
const DEFAULT_SELECTIONS = {
	course: [],
	programme: [],
	level: [],
};

const TagInputCtx = React.createContext<{
	selections: Selections;
	onChange: (id: SelectionId, values: string[]) => void;
	reset: VoidFunction;
}>({
	selections: {
		course: [],
		programme: [],
		level: [],
	},
	onChange: () => {},
	reset: () => {},
});

function useTagInputCtx() {
	return React.useContext(TagInputCtx);
}

interface Props extends React.PropsWithChildren {
	onDone?: (selections: Selections) => void;
	value?: Selections;
	className?: string;
}

function TagInput({ children, className, onDone, value }: Props) {
	const [showModal, setShowModal] = React.useState(false);
	const [selections, setSelections] =
		React.useState<Selections>(DEFAULT_SELECTIONS);

	const handleSelection = React.useCallback((id: string, values: string[]) => {
		setSelections((prev) => ({ ...prev, [id]: values }));
	}, []);

	function handleOnClose() {
		setShowModal(false);
		onDone?.(selections);
	}

	const handleModalClose = React.useCallback(() => setShowModal(false), []);

	const reset = React.useCallback(() => setSelections(DEFAULT_SELECTIONS), []);

	React.useEffect(() => {
		if (!value) {
			return;
		}

		setSelections(value);
	}, [value]);

	return (
		<TagInputCtx.Provider
			value={{ selections, onChange: handleSelection, reset }}
		>
			<button
				type="button"
				className={clsx(
					"size-8 bg-zinc-200 dark:bg-neutral-800 inline-flex justify-center items-center transition-[width] duration-200 px-2 gap-2",
					className,
				)}
				title="Add tag"
				onClick={() => setShowModal(true)}
			>
				{children || <div className="i-lucide-hash" />}
			</button>

			<Modal
				className="w-full max-w-[24rem]"
				open={showModal}
				onClose={handleModalClose}
			>
				<div className="bg-zinc-100 dark:bg-neutral-900 h-[24rem] flex flex-col">
					<Selection onClose={handleOnClose} />
				</div>
			</Modal>
		</TagInputCtx.Provider>
	);
}

interface SelectionProps {
	onClose: VoidFunction;
}

function Selection({ onClose }: SelectionProps) {
	const [stage, setStage] = React.useState<SelectionStage>("type");

	function handleClose() {
		setStage("type");
		onClose();
	}

	const props = {
		onSetStage: setStage,
		onReset: () => setStage("type"),
		onClose: handleClose,
	};

	switch (stage) {
		case "type":
			return <Stage1 onClose={handleClose} onSelect={setStage} />;
		case "course":
			return <TypeSelect {...props} useData={useTagCourses} id="course" />;
		case "programme":
			return (
				<TypeSelect {...props} useData={useTagProgrammes} id="programme" />
			);
		case "level":
			return <TypeSelect {...props} useData={useLevels} id="level" />;
		default:
			return null;
	}
}

const types = ["Course", "Programme", "Level"];

interface TagTypeSelectProps {
	onSelect: (type: SelectionStage) => void;
	onClose: VoidFunction;
}

function Stage1({ onSelect, onClose }: TagTypeSelectProps) {
	const { selections, reset } = useTagInputCtx();

	const filterCount = React.useMemo(
		() => Object.values(selections).flat().length,
		[selections],
	);

	return (
		<>
			<header className="p-2 pb-0">
				<div className="text-sm text-secondary flex items-center justify-between mb-2 font-medium">
					<div className="flex gap-2">
						<div className="i-lucide-hash" /> Select tag type
					</div>

					{filterCount > 0 && (
						<button
							className="bg-red-500 text-white px-1 rounded-md inline-flex items-center gap-1"
							type="button"
							onClick={() => reset()}
						>
							<span className="i-lucide-x inline-block" /> Clear selections
						</button>
					)}
				</div>
			</header>

			<ul className="p-2 pt-1 flex-1 overflow-y-auto [&>:last-child]:[&>:last-child]:hidden">
				{types.map((type) => {
					const selected = selections[type.toLowerCase() as SelectionId];

					return (
						<li key={type}>
							<button
								type="button"
								className="block w-full px-2 py-1 text-start rounded-lg hover:bg-zinc-200 dark:hover:bg-neutral-800"
								onClick={() => onSelect(type.toLowerCase() as SelectionStage)}
							>
								{type}{" "}
								{selected.length > 0 && (
									<span className="bg-zinc-300 dark:bg-neutral-800 rounded-lg px-2 text-sm">
										{selected.length}
									</span>
								)}
							</button>
							<hr className="dark:border-neutral-700 me-2 ms-2" />
						</li>
					);
				})}
			</ul>

			<div className="mx-2 text-secondary text-sm flex items-center gap-1">
				<span className="i-lucide-menu-square inline-block" />
				You can select tags from different types.
			</div>

			<footer className="p-2 border-t dark:border-t-neutral-700 flex justify-end">
				<Button onClick={onClose}>Done</Button>
			</footer>
		</>
	);
}

function useLevels(): ReturnType<UseData> {
	return {
		status: "ready",
		items: ["L100", "L200", "L300", "L400", "L500", "L600"],
		update: () => {},
		canAdd: false,
	};
}

interface StageProps {
	onSetStage: (type: SelectionStage) => void;
	onReset: () => void;
	onClose: VoidFunction;
	useData: UseData;
	id: SelectionId;
}

function TypeSelect({ onReset, onClose, useData, id }: StageProps) {
	const [q, setQ] = React.useState("");
	const { items, status, canAdd } = useData();

	const { selections, onChange } = useTagInputCtx();
	const selection = selections[id];

	const filteredItems = items.filter((item) =>
		item.toLocaleLowerCase().includes(q.toLowerCase().trim()),
	);

	function handleChange(item: string, checked: boolean) {
		if (Object.values(selections).flat().length >= TAG_LIMIT && checked) {
			alert("You can only select up to 4 tags");
			return;
		}

		const values = checked
			? [...selection, item]
			: selection.filter((value) => value !== item);

		onChange(id, values);
	}

	return (
		<>
			<header className="p-2 pb-0">
				<div className="text-sm text-secondary flex gap-2 items-center mb-2 font-medium">
					<div className="i-lucide-hash" /> Select {id}
				</div>

				<Input
					type="text"
					placeholder="Start typing…"
					value={q}
					onChange={(e) => setQ((e.target as HTMLInputElement).value)}
				/>
			</header>

			<ul className="px-2 flex-1 mt-2 overflow-y-auto">
				{filteredItems.map((item) => (
					<li key={item}>
						<label className="flex items-center gap-2 px-2 py-1 hover:bg-zinc-200 dark:hover:bg-neutral-800 rounded-lg ">
							<input
								type="checkbox"
								className="rounded-md bg-zinc-300 dark:bg-neutral-700"
								checked={selection.includes(item)}
								onChange={(e) => handleChange(item, e.target.checked)}
							/>
							<span>{item}</span>
						</label>
					</li>
				))}
			</ul>

			{status === "loading" && (
				<div className="flex gap-2 items-center text-secondary px-2 py-1">
					<div className="i-svg-spinners-180-ring-with-bg" /> Updating list…
				</div>
			)}

			{canAdd && (
				<div className="text-secondary p-2 text-sm">
					Can't find a programme or course? Check{" "}
					<Link
						className="text-blue-700 dark:text-blue-500 underline"
						to="/timetable"
					>
						Timetable
					</Link>{" "}
					and add from there.
				</div>
			)}

			<footer className="p-2 border-t dark:border-t-neutral-700 flex justify-between">
				<div className="flex gap-2">
					<Button variant="neutral" onClick={onReset}>
						Back
					</Button>

					{/* {canAdd && (
						<Button variant="neutral">
							<div className="i-lucide-plus opacity-50" /> Add {id}
						</Button>
					)} */}
				</div>

				<Button onClick={onClose}>Done</Button>
			</footer>
		</>
	);
}

export { TagInput, DEFAULT_SELECTIONS };

export type { SelectionId, Selections };
