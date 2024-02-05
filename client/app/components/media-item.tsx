import { Media } from "@prisma/client";
import { ellipsizeFilename, humanizeSize } from "~/lib/files";
import { NonImageThumb } from "./non-image-thumb";
import { AudioItem } from "./audio-item";

interface Props {
	media: Media;
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
		<div className="text-sm flex gap-2 py-1 px-1 rounded-lg border border-zinc-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 !bg-opacity-30">
			<div>
				<Thumbnail
					contentType={media.contentType}
					name={media.filename}
					thumbnail={media.thumbnail}
				/>
			</div>

			<div>
				<div className="font-mono">{ellipsizeFilename(media.filename)}</div>
				<div className="text-secondary leading-none">
					{humanizeSize(media.size)}
				</div>
			</div>
		</div>
	);
}

function Thumbnail({
	contentType,
	thumbnail,
	name,
}: { contentType: string; name: string; thumbnail?: string | null }) {
	if (contentType.startsWith("image/")) {
		return (
			<img
				src={thumbnail}
				width={30}
				alt={name}
				className="size-10 object-cover rounded-lg border"
			/>
		);
	}

	return <NonImageThumb contentType={contentType} />;
}

export { MediaItem };
