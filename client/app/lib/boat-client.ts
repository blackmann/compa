import { Device } from "mediasoup-client";
import { Peer, WebSocketTransport } from "protoo-client";

interface PeerInfo {
	id: string;
	stream: MediaStream;
}

type JoinCallback = (peer: PeerInfo) => void | Promise<void>;
type LeaveCallback = (peerId: string) => void | Promise<void>;

type CallbackMap = {
	join: JoinCallback;
	leave: LeaveCallback;
};

class BoatClient {
	private endpoint: string;
	private client: Peer | null = null;
	private device: Device;

	private onJoin: JoinCallback | null = null;
	private onLeave: LeaveCallback | null = null;

	peers: PeerInfo[] = [];

	/**
	 * @example
	 * const boat = new BoatClient('ws://localhost:3000/room/<room-id>/<peer-id>');
	 */
	constructor(endpoint: string) {
		this.endpoint = endpoint;
		this.device = new Device();
	}

	async connect(options: { stream: MediaStream }) {
		const ws = new WebSocketTransport(this.endpoint);
		const client = new Peer(ws);

		this.client = client;

		this.client.on("open", async () => {
			const rtpCapabilities = await client.request("getRtpCapabilities");
			await this.device.load({ routerRtpCapabilities: rtpCapabilities });

			const data = await client.request("createProducerTransport", {
				rtpCapabilities,
			});

			const transport = this.device.createSendTransport(data);
			transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
				try {
					await client.request("connectProducerTransport", {
						dtlsParameters,
					});
					callback();
				} catch (err) {
					errback(err as Error);
				}
			});

			transport.on(
				"produce",
				async ({ kind, rtpParameters }, callback, errback) => {
					try {
						const { id } = await client.request("produce", {
							id: transport.id,
							kind,
							rtpParameters,
						});

						callback({ id });
					} catch (err) {
						errback(err as Error);
					}
				},
			);

			// TODO: check parameters if we're producing video/audio or audio only
			await transport.produce({
				track: options.stream.getVideoTracks()[0],
			});

			await transport.produce({ track: options.stream.getAudioTracks()[0] });

			// then ask for existing peers
			const peers = await client.request("getPeers");
			for (const peer of peers) await this.admit(peer);

			await client.request("notifyJoin");
		});

		this.client.on("request", async (request, accept) => {
			switch (request.method) {
				case "newPeer": {
					await this.admit(request.data);
					return accept();
				}

				case "disconnectPeer": {
					const peerId = request.data.peerId;
					const peer = this.peers.find((p) => p.id === peerId);
					if (peer) {
						for (const track of peer.stream.getTracks()) track.stop();

						this.peers = this.peers.filter((p) => p.id !== peerId);
					}

					await this.onLeave?.(peerId);
					return accept();
				}
			}
		});
	}

	async disconnect() {
		if (!this.client) return;
		await this.client.request("disconnect");
	}

	async admit(peerId: string) {
		const client = this.client;
		if (!client) return;

		const data = await client.request("createConsumerTransport");
		const transport = this.device.createRecvTransport(data);

		transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
			try {
				await client.request("connectConsumerTransport", {
					transportId: transport.id,
					dtlsParameters,
				});

				callback();
			} catch (err) {
				errback(err as Error);
			}
		});

		const trackInfos = await client.request("consume", {
			peerId: peerId,
			rtpCapabilities: this.device.rtpCapabilities,
		});

		const stream = new MediaStream();
		for (const info of trackInfos) {
			const consumer = await transport.consume({
				id: info.id,
				producerId: info.producerId,
				rtpParameters: info.rtpParameters,
				kind: info.kind,
			});

			stream.addTrack(consumer.track);
		}

		const peerInfo = { id: peerId, stream };
		this.peers.push(peerInfo);
		await this.onJoin?.(peerInfo);

		await client.request("resumeConsume");
	}

	on(event: "join", callback: JoinCallback): void;
	on(event: "leave", callback: LeaveCallback): void;
	on<T extends keyof CallbackMap>(event: T, callback: CallbackMap[T]) {
		switch (event) {
			case "join":
				this.onJoin = callback as JoinCallback;
				break;

			case "leave":
				this.onLeave = callback as LeaveCallback;
				break;
		}
	}
}

export { BoatClient };
