import clsx from "clsx";

interface Props {
	contentType: string;
	className?: string;
}

function FileThumbnail({ className, contentType }: Props) {
	if (contentType.startsWith("image/")) {
		return (
			<div
				className={clsx(
					"size-10 rounded-lg bg-zinc-100 dark:bg-neutral-700 items-center justify-center flex text-secondary",
					className,
				)}
			>
				<div className="i-lucide-image size-6" />
			</div>
		);
	}

	if (contentType.startsWith("video/")) {
		return (
			<div
				className={clsx(
					"size-10 rounded-lg bg-zinc-100 dark:bg-neutral-700 items-center justify-center flex text-secondary",
					className,
				)}
			>
				<div className="i-lucide-video size-6" />
			</div>
		);
	}

	if (contentType.startsWith("audio/")) {
		return (
			<div
				className={clsx(
					"size-10 rounded-lg bg-zinc-100 dark:bg-neutral-700 items-center justify-center flex text-secondary",
					className,
				)}
			>
				<div className="i-lucide-music size-6" />
			</div>
		);
	}

	if (
		[
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		].includes(contentType)
	) {
		return (
			<div
				className={clsx(
					"size-10 rounded-lg bg-zinc-100 dark:bg-neutral-700 items-center justify-center flex text-secondary",
					className,
				)}
			>
				<div className="i-lucide-file-text size-6" />
			</div>
		);
	}

	if (
		[
			"application/vnd.openxmlformats-officedocument.presentationml.presentation",
		].includes(contentType)
	) {
		return (
			<div
				className={clsx(
					"size-10 rounded-lg bg-zinc-100 dark:bg-neutral-700 items-center justify-center flex text-secondary",
					className,
				)}
			>
				<div className="i-lucide-monitor-play size-6" />
			</div>
		);
	}

	return (
		<div
			className={clsx(
				"size-10 rounded-lg bg-zinc-100 dark:bg-neutral-700 items-center justify-center flex text-secondary",
				className,
			)}
		>
			<div className="i-lucide-asterisk size-6" />
		</div>
	);
}

export { FileThumbnail };
