import { useRouteLoaderData } from "@remix-run/react";
import React from "react";
import type { loader as rootLoader } from "../root";
import { BoatClient } from "./boat-client";

const WAIT_TIME = 10_000;

type Status = "idle" | "connecting" | "connected";

interface Peer {
	id: string;
}

const ParlonContext = React.createContext({
	call: () => {},
	peerStream: null as MediaStream | null,
	selfStream: null as MediaStream | null,
	setShyMode: (shyMode: boolean) => {},
	shyMode: true,
	status: "idle" as Status,
	requestCamera: () => {},
	peer: null as Peer | null,
	end: () => {},
	muted: false,
	setMuted: (muted: boolean) => {},
});

function ParlonProvider({ children }: React.PropsWithChildren) {
	const { user } = useRouteLoaderData<typeof rootLoader>("root") || {};
	const [selfStream, setSelfStream] = React.useState<MediaStream | null>(null);
	const [peerStream, setPeerStream] = React.useState<MediaStream | null>(null);

	const [shyMode, setShyMode] = React.useState(true);
	const [muted, setMuted] = React.useState(false);
	const [status, setStatus] = React.useState<Status>("idle");

	const [peer, setPeer] = React.useState<Peer | null>(null);

	const boat = React.useRef<BoatClient | null>(null);

	const reset = React.useCallback(() => {
		setStatus("idle");
		setPeer(null);
		setPeerStream(null);
	}, []);

	const requestCamera = React.useCallback(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => setSelfStream(stream))
			.catch(console.error);
	}, []);

	const call = React.useCallback(async () => {
		if (!(user && selfStream)) return;
		// TODO: make sure same user can't call twice (from another tab/device)
		setStatus("connecting");

		boat.current?.disconnect();
		const res = await fetch("/parlon/call");
		const { roomId } = await res.json();

		const base = import.meta.env.VITE_BOAT_SIGNAL;
		const prefix = shyMode ? "shy:" : "";
		const endpoint = [base, "join", roomId, prefix + user.username].join("/");
		const conn = new BoatClient(endpoint);

		conn.on("join", (peer) => {
			setStatus("connected");

			setPeer({ id: peer.id });
			setPeerStream(peer.stream);
		});

		conn.on("leave", () => {
			reset();
			boat.current?.disconnect();
			boat.current = null;
		});

		await conn.connect({ stream: selfStream });

		boat.current = conn;

		// if this person created the room, and no one joined
		// in WAIT_TIME seconds, then go back to idle
		const id = setTimeout(() => {
			if (!conn.peers.length) {
				reset();
				boat.current = null;
				conn.disconnect();
			}
		}, WAIT_TIME);

		return () => clearTimeout(id);
	}, [user, selfStream, shyMode, reset]);

	const end = React.useCallback(() => {
		boat.current?.disconnect();
		reset();
	}, [reset]);

	React.useEffect(() => {
		for (const track of selfStream?.getAudioTracks() || []) {
			track.enabled = !muted;
		}
	}, [muted, selfStream]);

	const providerValue = {
		call,
		peer,
		peerStream,
		requestCamera,
		selfStream,
		setShyMode,
		shyMode,
		status,
		end,
		muted,
		setMuted,
	};

	return (
		<ParlonContext.Provider value={providerValue}>
			{children}
		</ParlonContext.Provider>
	);
}

function useParlon() {
	return React.useContext(ParlonContext);
}

export { ParlonContext, ParlonProvider, useParlon };
