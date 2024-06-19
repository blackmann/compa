import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getRoom } from "~/lib/boat-relay.server";
import { checkAuth } from "~/lib/check-auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await checkAuth(request);

	const roomId = (await getRoom()) as string;
	return json({ roomId });
};
