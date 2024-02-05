interface Props {
	file: File;
	onRemove?: VoidFunction;
}

function FileSelectItem({ file, onRemove }: Props) {
	return (
		<div className="flex border rounded-lg p-1 gap-2">
			<div className=" shrink-0">
				<Thumbnail file={file} />
			</div>

			<div className="flex-1">
				<div className="font-mono leading-tight line-clamp-1">
					{ellipsizeFilename(file.name)}
				</div>
				<div className="text-secondary text-sm leading-none">
					{humanizeSize(file.size)}
				</div>
			</div>

			<div>
				<button
					type="button"
					className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-[background] duration-200"
					onClick={onRemove}
				>
					<div className="i-lucide-x" />
				</button>
			</div>
		</div>
	);
}

function Thumbnail({ file }: Props) {
	if (file.type.startsWith("image/")) {
		return (
			<img
				src={URL.createObjectURL(file)}
				width={30}
				alt={file.name}
				className="size-10 object-cover rounded-lg border"
			/>
		);
	}

	if (file.type.startsWith("video/")) {
		return (
			<div className="size-10 rounded-lg bg-zinc-100 items-center justify-center flex text-secondary">
				<div className="i-lucide-video size-6" />
			</div>
		);
	}

	if (file.type.startsWith("audio/")) {
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
		].includes(file.type)
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

function ellipsizeFilename(name: string, length = 14) {
	const parts = name.split(".");
	if (parts.length === 1) {
		return `${name.slice(0, length)}…`;
	}
	const [filename, ...extension] = parts;
	return `${filename.slice(0, length)}…${extension[extension.length - 1]}`;
}

function humanizeSize(s: number) {
	const units = ["B", "KB", "MB", "GB"];
	let i = 0;
	let size = s;
	while (size >= 1024 && i < units.length) {
		size /= 1024;
		i++;
	}
	return `${size.toFixed(1)}${units[i]}`;
}

export { FileSelectItem };
