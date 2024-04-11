import { Media } from "@prisma/client";
import { ellipsizeFilename, humanizeSize } from "~/lib/files";
import { FileThumbnail } from "./non-image-thumb";
import { AudioItem } from "./audio-item";
import { Jsonify } from "type-fest";
import clsx from "clsx";

interface Props {
	media: Media | Jsonify<Media>;
	noPlay?: boolean;
}

function MediaItem({ media, noPlay }: Props) {
	if (media.contentType.startsWith("audio/")) {
		return (
			<AudioItem
				noPlay={noPlay}
				url={media.url}
				size={media.size}
				name={media.filename}
			/>
		);
	}

	return (
		<div className="text-start text-sm flex gap-2 py-1 px-1 rounded-lg border border-zinc-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 !bg-opacity-30">
			<div>
				<Thumbnail
					contentType={media.contentType}
					name={media.filename}
					thumbnail={media.thumbnail}
				/>
			</div>

			<div>
				<div className="font-mono break-all">
					{ellipsizeFilename(media.filename)}
				</div>
				<div className="text-secondary leading-none">
					{humanizeSize(media.size)}
				</div>
			</div>
		</div>
	);
}

interface ThumbnailProps {
	contentType: string;
	name: string;
	thumbnail?: string | null;
	className?: string;
}

function Thumbnail({
	className,
	contentType,
	thumbnail,
	name,
}: ThumbnailProps) {
	if (contentType.startsWith("image/")) {
		return (
			<img
				src={thumbnail as string}
				alt={name}
				className={clsx(
					"size-10 object-cover rounded-lg border dark:border-neutral-700",
					className,
				)}
			/>
		);
	}

	return <FileThumbnail className={className} contentType={contentType} />;
}

export { MediaItem, Thumbnail };
