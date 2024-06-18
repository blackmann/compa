import React from "react";

type ConnectionStatus = "connected" | "idle" | "connecting";

function PeerVideoPanel() {
	const [connection, setConnection] = React.useState<ConnectionStatus>("idle");

	if (connection !== "connected") {
		return (
			<div className="rounded-lg bg-zinc-200 aspect-[5/4] dark:bg-neutral-800 flex justify-center items-center">
				<div className="text-center">
					{connection === "idle" ? (
						<button
							className="bg-blue-500 text-white p-4 rounded-full aspect-square leading-none font-bold text-2xl"
							type="button"
							onClick={() => setConnection("connecting")}
						>
							<div>
								Find <br />
								the one
							</div>
							<div className="text-sm opacity-60">Tap here</div>
						</button>
					) : (
						<div className="flex gap-2 font-medium items-center">
							<div className="i-svg-spinners-pulse-3 text-red-500 text-3xl" /><div className="text-secondary text-sm">A moment! Connecting…</div>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg bg-zinc-200 aspect-[5/4] dark:bg-neutral-800 flex flex-col justify-between">
			<header className="justify-between flex items-start p-2">
				<div>
					<div className="font-mono">@mufasa</div>
				</div>
				<div>
					<span className="text-secondary">Reveal in</span>{" "}
					<span className="font-mono">10</span>
				</div>
			</header>
			<footer className="flex justify-end p-2">
				<button
					type="button"
					className="px-2 py-1 rounded-full bg-red-500 flex items-center gap-2 font-medium text-white"
				>
					<div className="i-lucide-phone-off" /> Hang up
				</button>
			</footer>
		</div>
	);
}

export { PeerVideoPanel };
