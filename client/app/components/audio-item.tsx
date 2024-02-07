import clsx from "clsx";
import React from "react";
import { ellipsizeFilename, humanizeSize } from "~/lib/files";

interface Props {
	url: string;
	name: string;
	size: number;
	onRemove?: VoidFunction;
	noPlay?: boolean;
}

type DownloadState = "idle" | "downloading" | "downloaded";

function AudioItem({ name, url, noPlay, onRemove, size }: Props) {
	const [playing, setPlaying] = React.useState<boolean>();
	const [downloadState, setDownloadState] =
		React.useState<DownloadState>("idle");

	const audioRef = React.useRef<HTMLAudioElement>();

	function togglePlay(e: React.MouseEvent<HTMLButtonElement>) {
		if (noPlay) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		if (downloadState === "downloading") {
			return;
		}

		if (downloadState !== "downloaded") {
			setDownloadState("downloading");

			fetch(url, { mode: "no-cors" })
				.then(async (res) => {
					// this will bring the audio to cache
					const audio = new Audio(url);
					audioRef.current = audio;

					audio.addEventListener("ended", () => {
						setPlaying(false);
					});

					setDownloadState("downloaded");
				})
				.catch(() => setDownloadState("idle"));

			return;
		}

		if (!audioRef.current) {
			return;
		}

		playing ? audioRef.current.pause() : audioRef.current.play();
		setPlaying(!playing);
	}

	React.useEffect(() => {
		return () => {
			audioRef.current?.pause();
		};
	}, []);

	return (
		<div className="flex border bg-white dark:bg-neutral-900 !bg-opacity-30 rounded-lg p-1 gap-2">
			<div className=" shrink-0">
				<button
					type="button"
					className="size-10 rounded-lg bg-zinc-100 dark:bg-neutral-700 items-center justify-center flex text-secondary"
					onClick={togglePlay}
				>
					<div
						className={clsx("i-lucide-play size-6", {
							"!i-lucide-music": downloadState === "idle",
							"!i-lucide-pause": playing === true,
							"i-svg-spinners-180-ring-with-bg":
								downloadState === "downloading",
						})}
					/>
				</button>
			</div>

			<div className="flex-1">
				<div className="font-mono leading-tight line-clamp-1 text-sm">
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
