import { Queue } from "@datastructures-js/queue";
import { queue } from "async";

const waitQueue = new Queue<string>();
const ENDPOINT = [import.meta.env.VITE_BOAT_URL, "rooms"].join("/");

const queueHandle = queue(async (_, cb) => {
	const front = waitQueue.pop();
	if (front) return front;

	const res = await fetch(ENDPOINT, {
		method: "POST",
		body: JSON.stringify({ maxPeers: 2 }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	console.log("status", res.status);

	const { roomId } = await res.json();
	waitQueue.enqueue(roomId);

	return roomId as string;
});

async function getRoom() {
	return await queueHandle.push(null);
}

export { getRoom };
