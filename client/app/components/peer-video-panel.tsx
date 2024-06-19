import clsx from "clsx";
import React from "react";
import { useParlon } from "~/lib/parlon-context";
import useCountdown from "~/lib/use-countdown";

function PeerVideoPanel() {
	const { peerStream, peer, status, call, end } = useParlon();
	const videoRef = React.useRef<HTMLVideoElement>(null);
	const ding = React.useRef<HTMLAudioElement>(null);

	const { time, start, stop } = useCountdown(10);

	const [shy, peerNickname] = React.useMemo(() => {
		if (!peer) return [false, null];

		if (peer.id.startsWith("shy:")) {
			return [true, peer.id.slice(4)];
		}

		return [false, peer.id];
	}, [peer]);

	React.useEffect(() => {
		if (!videoRef.current || !peerStream) return;
		ding.current?.play();

		if (shy) start();

		const id = setTimeout(
			() => {
				(videoRef.current as HTMLVideoElement).srcObject = peerStream;
			},
			shy ? 10_000 : 0,
		);

		return () => {
			clearTimeout(id);
			stop();
		};
	}, [peerStream, shy, start, stop]);

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
		<div
			className={clsx(
				"rounded-lg bg-zinc-200 aspect-[5/4] dark:bg-neutral-800 flex flex-col justify-between relative",
				{ "!bg-neutral-800": shy },
			)}
		>
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
					<div className="font-mono text-white">@{peerNickname}</div>
				</div>

				{shy && time > 0 && (
					<div>
						<span className="text-secondary">Reveal in</span>{" "}
						<span className="font-mono text-white">{time}</span>
					</div>
				)}
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
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio ref={ding} id="ding" src="/zasplat_connected_ding.mp3" />
		</div>
	);
}

export { PeerVideoPanel };
