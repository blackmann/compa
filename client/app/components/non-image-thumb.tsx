interface Props {
	contentType: string;
}

function NonImageThumb({ contentType }: Props) {
	if (contentType.startsWith("video/")) {
		return (
			<div className="size-10 rounded-lg bg-zinc-100 items-center justify-center flex text-secondary">
				<div className="i-lucide-video size-6" />
			</div>
		);
	}

	if (contentType.startsWith("audio/")) {
		return (
			<div className="size-10 rounded-lg bg-zinc-100 items-center justify-center flex text-secondary">
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
			<div className="size-10 rounded-lg bg-zinc-100 items-center justify-center flex text-secondary">
				<div className="i-lucide-file-text size-6" />
			</div>
		);
	}

	return (
		<div className="size-10 rounded-lg bg-zinc-100 items-center justify-center flex text-secondary">
			<div className="i-lucide-asterisk size-6" />
		</div>
	);
}

export { NonImageThumb };
