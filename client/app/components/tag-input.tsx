import React from "react";
import { Modal } from "./modal";
import { Button } from "./button";

function TagInput() {
	const [showModal, setShowModal] = React.useState(false);

	return (
		<>
			<button
				type="button"
				className="size-8 bg-zinc-200 dark:bg-neutral-800 inline-flex justify-center items-center transition-[width] duration-200 px-2 gap-2"
				title="Add tag"
				onClick={() => setShowModal(true)}
			>
				<div className="i-lucide-hash" />
			</button>

			<Modal className="w-full max-w-[24rem]" open={showModal} onClose={() => setShowModal(false)}>
				<div className="bg-zinc-100">
					<Selection />
				</div>
			</Modal>
		</>
	);
}

// TODO: Add others like entertainment, etc.
type SelectionStage = "type" | "course" | "programme" | "level";

function Selection() {
	const [stage, setStage] = React.useState<SelectionStage>("type");

	return <Stage1 />;
}

const types = ["Course", "Programme", "Level"];
function Stage1() {
	return (
		<>
			<header className="p-2 pb-0">
				<div className="text-sm text-secondary flex gap-2 items-center mb-2 font-medium">
					<div className="i-lucide-hash" /> Select tag type
				</div>
			</header>

			<ul className="p-2 pt-0">
				{types.map((type) => (
					<li key={type}>
						<button
							type="button"
							className="w-full px-2 py-1 text-start rounded-lg hover:bg-zinc-200"
						>
							{type}
						</button>
					</li>
				))}
			</ul>

			<footer className="p-2 border-t flex justify-between">
				<Button variant="neutral">Cancel</Button>
				<Button>Done</Button>
			</footer>
		</>
	);
}

export { TagInput };
