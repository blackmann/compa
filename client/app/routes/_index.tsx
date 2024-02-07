import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { userPrefs } from "~/lib/cookies.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const cookies: Record<string, string> =
		(await userPrefs.parse(request.headers.get("Cookie"))) || {};

	if (cookies.lastBase) {
		return redirect(`/${cookies.lastBase}`);
	}

	return redirect("/timetable");
};
