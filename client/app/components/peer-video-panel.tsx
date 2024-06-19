import React from "react";
import { useParlon } from "~/lib/parlon-context";

function PeerVideoPanel() {
	const { peerStream, peer, status, call, end } = useParlon();
	const videoRef = React.useRef<HTMLVideoElement>(null);

	React.useEffect(() => {
		if (!videoRef.current || !peerStream) return;

		videoRef.current.srcObject = peerStream;
	}, [peerStream]);

	if (status !== "connected") {
		return (
			<div className="rounded-lg bg-zinc-200 aspect-[5/4] dark:bg-neutral-800 flex justify-center items-center">
				<div className="text-center">
					{status === "idle" ? (
						<button
							className="bg-blue-500 text-white p-4 rounded-full aspect-square leading-none font-bold text-2xl"
							type="button"
							onClick={() => call()}
						>
							<div>
								Find <br />
								the one
							</div>
							<div className="text-sm opacity-60">Tap here</div>
						</button>
					) : (
						<div className="flex gap-2 font-medium items-center">
							<div className="i-svg-spinners-pulse-3 text-red-500 text-3xl" />
							<div className="text-secondary text-sm">A moment! Searching…</div>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg bg-zinc-200 aspect-[5/4] dark:bg-neutral-800 flex flex-col justify-between relative">
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
					<div className="font-mono">@{peer?.id}</div>
				</div>

				<div>
					<span className="text-secondary">Reveal in</span>{" "}
					<span className="font-mono">10</span>
				</div>
			</header>

			<footer className="flex justify-end p-2 absolute bottom-0 left-0 w-full rounded-b-lg">
				<button
					type="button"
					className="px-2 py-1 rounded-full bg-red-500 flex items-center gap-2 font-medium text-white"
					onClick={end}
				>
					<div className="i-lucide-phone-off" /> Hang up
				</button>
			</footer>
		</div>
	);
}

export { PeerVideoPanel };
