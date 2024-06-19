import clsx from "clsx";
import React from "react";
import { useParlon } from "~/lib/parlon-context";

function SelfVideoPanel() {
	const { selfStream: stream, shyMode, setShyMode } = useParlon();

	const [muted, setMuted] = React.useState(false);

	const videoRef = React.useRef<HTMLVideoElement>(null);

	React.useEffect(() => {
		if (!videoRef.current || !stream) return;
		const ms = new MediaStream();
		ms.addTrack(stream.getVideoTracks()[0]);
		videoRef.current.srcObject = ms;
	}, [stream]);

	return (
		<div className="rounded-lg bg-zinc-200 aspect-[5/4] dark:bg-neutral-800 relative">
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<video
				ref={videoRef}
				autoPlay
				className="w-full h-full rounded-lg overflow-hidden object-cover"
				style={{ transform: "scaleX(-1)" }}
				playsInline
			/>

			<header
				className="justify-between flex items-start p-2 absolute top-0 left-0 w-full rounded-t-lg"
				style={{
					background:
						"linear-gradient(0deg, transparent 0%, rgba(0,0,0,0.4) 100%)",
				}}
			>
				<div>
					<div className="font-mono font-medium text-white leading-none">
						@notgr<span className="opacity-50">&bull;you</span>
					</div>
					{muted && (
						<p className="text-sm opacity-70 text-white">You're muted</p>
					)}
				</div>

				<div className="flex gap-2 items-center">
					<button
						className={clsx(
							"flex gap-2 items-center rounded-full px-2 py-1 bg-zinc-300 dark:bg-neutral-700 font-medium duration-200",
							{ "!bg-green-500 text-white": shyMode },
						)}
						type="button"
						onClick={() => setShyMode(!shyMode)}
					>
						<div>🙈</div> Shy mode {shyMode ? "on" : "off"}
					</button>

					<button
						className={clsx(
							"aspect-square rounded-full p-2 bg-blue-500 text-xl text-white duration-200",
							{ "bg-red-500": muted },
						)}
						type="button"
						onClick={() => setMuted(!muted)}
					>
						<div
							className={clsx({
								"i-lucide-mic": !muted,
								"i-lucide-mic-off": muted,
							})}
						/>
					</button>
				</div>
			</header>
		</div>
	);
}

export { SelfVideoPanel };
