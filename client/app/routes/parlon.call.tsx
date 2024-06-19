import { json } from "@remix-run/node";
import { getRoom } from "~/lib/boat-relay.server";

export const loader = async () => {
	const roomId = (await getRoom()) as string;
	return json({ roomId });
};
