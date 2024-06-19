import { Queue } from "@datastructures-js/queue";
import { queue } from "async";

const waitQueue = new Queue<string>();
const ENDPOINT = [import.meta.env.VITE_BOAT_URL, "rooms"].join("/");

const queueHandle = queue(async (_, cb) => {
	console.log("and this one eh");
	const front = waitQueue.pop();
	if (front) return front;

	try {
		const res = await fetch(ENDPOINT, {
			method: "POST",
			body: JSON.stringify({ maxPeers: 2 }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const { roomId } = await res.json();
		waitQueue.enqueue(roomId);

		return roomId as string;
	} catch (err) {
		console.error("[boat] Error getting a room", err);
	}
});

async function getRoom() {
	return await queueHandle.push(null);
}

export { getRoom };
