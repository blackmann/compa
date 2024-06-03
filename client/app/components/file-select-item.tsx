import { ellipsizeFilename, humanizeSize } from "~/lib/files";
import { AudioItem } from "./audio-item";
import { FileThumbnail } from "./non-image-thumb";

interface Props {
	file: File;
	onRemove?: VoidFunction;
}

function FileSelectItem({ file, onRemove }: Props) {
	if (file.type.startsWith("audio/")) {
		return (
			<AudioItem
				name={file.name}
				url={URL.createObjectURL(file)}
				size={file.size}
				onRemove={onRemove}
			/>
		);
	}

	return (
		<div className="flex border dark:border-neutral-700 rounded-lg p-1 gap-2">
			<div className=" shrink-0">
				<Thumbnail file={file} />
			</div>

			<div className="flex-1">
				<div className="font-mono leading-tight line-clamp-1 break-all text-sm">
					{ellipsizeFilename(file.name)}
				</div>

				<div className="text-secondary text-sm leading-none">
					{humanizeSize(file.size)}
				</div>
			</div>

			<div>
				<button
					type="button"
					className="p-2 rounded-full !bg-zinc-100 !dark:bg-neutral-800 hover:bg-zinc-200 dark:hover:bg-neutral-700 transition-[background] duration-200"
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
				className="size-10 object-cover rounded-lg border dark:border-neutral-700"
			/>
		);
	}

	return <FileThumbnail contentType={file.type} />;
}

export { FileSelectItem };
