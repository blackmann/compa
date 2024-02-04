function MediaItem() {
	return (
		<div className="text-sm flex gap-2 py-1 px-1 rounded-lg border border-zinc-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 !bg-opacity-30">
			<div>
				<div className="w-8 h-9 bg-rose-500 rounded-md" />
			</div>

			<div>
				<div className="font-mono">logic_assignment.jpg</div>
				<div className="text-secondary leading-none">image</div>
			</div>
		</div>
	);
}

export { MediaItem };
