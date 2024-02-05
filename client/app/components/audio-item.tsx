import clsx from "clsx";
import React from "react";
import { ellipsizeFilename, humanizeSize } from "~/lib/files";
import { useMounted } from "~/lib/use-mounted";

interface Props {
	url: string;
	name: string;
	size: number;
	onRemove?: VoidFunction;
	noPlay?: boolean;
}

function AudioItem({ name, url, noPlay, onRemove, size }: Props) {
	const [playing, setPlaying] = React.useState<boolean>();
	const mounted = useMounted();

	const audio = React.useMemo(() => {
		if (!mounted) {
			return;
		}

		const audio = new Audio(url);
		audio.addEventListener("ended", () => setPlaying(undefined));

		return audio;
	}, [url, mounted]);

	function togglePlay(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
		e.stopPropagation();

		if (noPlay || !audio) {
			return;
		}

		playing ? audio.pause() : audio.play();
		setPlaying(!playing);
	}

	return (
		<div className="flex border dark:border-neutral-700 rounded-lg p-1 gap-2">
			<div className=" shrink-0">
				<button
					type="button"
					className="size-10 rounded-lg bg-zinc-100 dark:bg-neutral-700 items-center justify-center flex text-secondary"
					onClick={togglePlay}
				>
					<div
						className={clsx("i-lucide-music size-6", {
							"i-lucide-play": playing === false,
							"i-lucide-pause": playing === true,
						})}
					/>
				</button>
			</div>

			<div className="flex-1">
				<div className="font-mono leading-tight line-clamp-1">
					{ellipsizeFilename(name)}
				</div>
				<div className="text-secondary text-sm leading-none">
					{humanizeSize(size)}
				</div>
			</div>

			{onRemove && (
				<div>
					<button
						type="button"
						className="p-2 rounded-full bg-zinc-100 dark:bg-neutral-800 hover:bg-zinc-200 dark:hover:bg-neutral-700 transition-[background] duration-200"
						onClick={onRemove}
					>
						<div className="i-lucide-x" />
					</button>
				</div>
			)}
		</div>
	);
}

export { AudioItem };
