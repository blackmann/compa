function TagSelect() {
	return (
		<div className="flex mb-1 gap-1 flex-wrap">
			<div className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2 inline-flex items-center gap-1">
				L200 <button className="i-lucide-x text-secondary" type="button" />
			</div>

			<div className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2 inline-flex items-center gap-1">
				BSc. Statistics{" "}
				<button className="i-lucide-x text-secondary" type="button" />
			</div>

			<div className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2 inline-flex items-center gap-1">
				Logic + Set Theory{" "}
				<button className="i-lucide-x text-secondary" type="button" />
			</div>
		</div>
	);
}

export { TagSelect };
